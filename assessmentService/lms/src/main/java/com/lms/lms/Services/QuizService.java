package com.lms.lms.Services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lms.lms.DTOS.AnswerSubmission;
import com.lms.lms.DTOS.AttemptResultResponse;
import com.lms.lms.DTOS.QuestionRequestDto;
import com.lms.lms.DTOS.QuestionResponse;
import com.lms.lms.DTOS.QuizRequestDto;
import com.lms.lms.DTOS.QuizResponse;
import com.lms.lms.DTOS.QuizResponseDto;
import com.lms.lms.DTOS.QuizSubmissionRequest;
import com.lms.lms.Entity.Answer;
import com.lms.lms.Entity.Course;
import com.lms.lms.Entity.Lesson;
import com.lms.lms.Entity.Question;
import com.lms.lms.Entity.Quiz;
import com.lms.lms.Entity.QuizAttempt;
import com.lms.lms.Entity.User;
import com.lms.lms.Repo.AnswerRepository;
import com.lms.lms.Repo.CertificateRepository;
import com.lms.lms.Repo.CourseExamRepository;
import com.lms.lms.Repo.CourseProgressRepository;
import com.lms.lms.Repo.CourseRepository;
import com.lms.lms.Repo.EnrollmentRepository;
import com.lms.lms.Repo.ExamAttemptRepository;
import com.lms.lms.Repo.LessonRepository;
import com.lms.lms.Repo.QuestionRepository;
import com.lms.lms.Repo.QuizAttemptRepository;
import com.lms.lms.Repo.QuizRepository;
import com.lms.lms.Repo.UserRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class QuizService {
    private final EnrollmentRepository enrollmentRepository;
        private final CourseRepository courseRepository;
        private final QuizRepository quizRepository;
        private final QuizAttemptRepository quizAttemptRepository;
        private final LessonRepository lessonRepository;
        private final AnswerRepository answerRepository;
        private final UserRepository userRepository;

        public QuizResponse CreeateQuiz(QuizRequestDto dto) {
        User instructor = getLoggedInInstructor();

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't own this course");
        }

        Lesson lesson = lessonRepository.findById(dto.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (!lesson.getCourse().getId().equals(course.getId())) {
            throw new RuntimeException("This lesson does not belong to the specified course");
        }
        

        Quiz quiz = new Quiz();
        quiz.setTitle(dto.getTitle());
        quiz.setTimeLimit(dto.getTimeLimit());
        quiz.setTotalQuestions(dto.getTotalQuestions());
        quiz.setPassingScore(dto.getPassingScore());
        quiz.setPublished(dto.getPublished());
        quiz.setLesson(lesson);
        quiz.getLesson().getCourse().setInstructor(instructor);
        
       return QuizResponse.fromEntity(quizRepository.save(quiz));

    }

    public  void DeleteQuiz(Long quizId) {
        User instructor = getLoggedInInstructor();

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getLesson().getCourse().getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't own this quiz");
        }   
        quizRepository.delete(quiz);
    }

    public QuizResponse getLessonQuiz(Long courseId, Long lessonId) {
        User student = getLoggedInStudent();

        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        Quiz quiz = quizRepository.findByLessonIdAndPublishedTrue(lessonId)
                .orElseThrow(() -> new RuntimeException("No quiz found for this lesson"));

        List<QuizAttempt> attempts = quizAttemptRepository
                .findByStudentAndQuizLessonIdOrderBySubmittedAtDesc(student, lessonId);

        boolean alreadyPassed = attempts.stream()
                .anyMatch(a -> a.getStatus() == QuizAttempt.Status.PASSED);

        if (alreadyPassed) {
            throw new RuntimeException("You have already passed this quiz");
        }

        return QuizResponse.fromEntity(quiz);
    }

    public AttemptResultResponse submitLessonQuiz(Long courseId, QuizSubmissionRequest request) {
        User student = getLoggedInStudent();

        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        Quiz quiz = quizRepository.findById(request.quizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        int totalQuestions = request.answers().size();
        int correctAnswers = gradeAnswers(request.answers());
        BigDecimal score = calculateScore(correctAnswers, totalQuestions);
        boolean passed = score.compareTo(quiz.getPassingScore()) >= 0;

        QuizAttempt attempt = new QuizAttempt();
        attempt.setStudent(student);
        attempt.setQuiz(quiz);
        attempt.setScore(score);
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setStatus(passed ? QuizAttempt.Status.PASSED : QuizAttempt.Status.FAILED);

        QuizAttempt saved = quizAttemptRepository.save(attempt);
        return new AttemptResultResponse(saved.getId(), "QUIZ", score,
                quiz.getPassingScore(), passed, totalQuestions, correctAnswers);
    }
// Private helper method to get the currently logged-in instructor
    private  User getLoggedInStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
    
    private int gradeAnswers(List<AnswerSubmission> answers) {
        int correct = 0;
        for (AnswerSubmission submission : answers) {
            boolean isCorrect = answerRepository
                    .findByQuestionIdAndCorrectTrue(submission.questionId())
                    .stream()
                    .anyMatch(a -> a.getId().equals(submission.selectedAnswerId()));
            if (isCorrect) correct++;
        }
        return correct;
    }

        private BigDecimal calculateScore(int correctAnswers, int totalQuestions) {
        if (totalQuestions == 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(correctAnswers * 100.0 / totalQuestions)
                .setScale(2, RoundingMode.HALF_UP);
    }
    
    private User getLoggedInInstructor() {
    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated()) {
        throw new RuntimeException("User not authenticated");
    }

    
    boolean isInstructor = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"));

    if (!isInstructor) {
        throw new RuntimeException("Access denied: Not an instructor");
    }

    String email = auth.getName();

    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
}
}
