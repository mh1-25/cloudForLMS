package com.lms.lms.Services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lms.lms.DTOS.AnswerSubmission;
import com.lms.lms.DTOS.AttemptResultResponse;
import com.lms.lms.DTOS.ExamRequestDto;
import com.lms.lms.DTOS.ExamResponse;
import com.lms.lms.DTOS.ExamScoreResponse;
import com.lms.lms.DTOS.ExamSubmissionRequest;
import com.lms.lms.DTOS.QuizScoreResponse;
import com.lms.lms.DTOS.StudentProgressResponse;
import com.lms.lms.Entity.Certificate;
import com.lms.lms.Entity.Course;
import com.lms.lms.Entity.CourseExam;
import com.lms.lms.Entity.CourseProgress;
import com.lms.lms.Entity.Enrollment;
import com.lms.lms.Entity.ExamAttempt;
import com.lms.lms.Entity.Lesson;
import com.lms.lms.Entity.Question;
import com.lms.lms.Entity.Quiz;
import com.lms.lms.Entity.QuizAttempt;
import com.lms.lms.Entity.User;
import com.lms.lms.Repo.*;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizAndExamService {
        private final EnrollmentRepository enrollmentRepository;
        private final CourseRepository courseRepository;
        private final QuizAttemptRepository quizAttemptRepository;
        private final CourseExamRepository courseExamRepository;
        private final ExamAttemptRepository examAttemptRepository;
        private final CourseProgressRepository courseProgressRepository;
        private final LessonRepository lessonRepository;
        private final CertificateRepository certificateRepository;
        private final AnswerRepository answerRepository;
        private final UserRepository userRepository;

    // Take final exam (fetch)
    public ExamResponse CreateExam(ExamRequestDto dto) {
        User instructor = getLoggedInInstructor();
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (!course.getInstructor().getId().equals(instructor.getId())) {
                throw new RuntimeException("You don't own this course");
        }
        CourseExam exam = new CourseExam();
        exam.setTitle(dto.getTitle());
        exam.setTimeLimit(dto.getTimeLimit());
        exam.setTotalQuestions(dto.getTotalQuestions());
        exam.setPassingScore(dto.getPassingScore());
        exam.setCourse(course);
        exam.getCourse().setInstructor(instructor);
        CourseExam saved = courseExamRepository.save(exam);
        return ExamResponse.fromEntity(saved);
    }
    public void deleteExam(Long examId) {
        User instructor = getLoggedInInstructor();
        CourseExam exam = courseExamRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        if (!exam.getCourse().getInstructor().getId().equals(instructor.getId())) {
                throw new RuntimeException("You don't own this course");
        }
        courseExamRepository.delete(exam);
}
public ExamResponse getCourseExam(Long courseId) {
        User student = getLoggedInStudent();

        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        CourseExam exam = courseExamRepository.findByCourseId(courseId)
                .orElseThrow(() -> new RuntimeException("No exam found for this course"));

        List<ExamAttempt> previousAttempts = examAttemptRepository
                .findByStudentAndCourseIdOrderByAttemptNumberDesc(student, courseId);

        if (previousAttempts.size() >= exam.getMaxAttempts()) {
                throw new RuntimeException("You have reached the maximum number of attempts for this exam");
        }

        return ExamResponse.fromEntity(exam);
    }

    // Take final exam  (submit)
    public AttemptResultResponse submitCourseExam(ExamSubmissionRequest request) {
        User student = getLoggedInStudent();

        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), request.courseId())
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        CourseExam exam = courseExamRepository.findByCourseId(request.courseId())
                .orElseThrow(() -> new RuntimeException("Exam not found for this course"));

        List<ExamAttempt> previousAttempts = examAttemptRepository
                .findByStudentAndCourseIdOrderByAttemptNumberDesc(student, request.courseId());

        if (previousAttempts.size() >= exam.getMaxAttempts()) {
            throw new RuntimeException("You have reached the maximum number of attempts for this exam");
        }

        int totalQuestions = request.answers().size();
        int correctAnswers = gradeAnswers(request.answers());
        BigDecimal score = calculateScore(correctAnswers, totalQuestions);
        boolean passed = score.compareTo(exam.getPassingScore()) >= 0;

        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        ExamAttempt attempt = new ExamAttempt();
        attempt.setStudent(student);
        attempt.setCourseExam(exam);
        attempt.setCourse(course);
        attempt.setScore(score);
        attempt.setPassed(passed);
        attempt.setAttemptNumber(previousAttempts.size() + 1);

        ExamAttempt saved = examAttemptRepository.save(attempt);

        if (passed) {
            Certificate certificate = new Certificate();
            certificate.setStudent(student);
            certificate.setCourse(course);
            certificate.setFinalScore(score);
            certificate.setCertificateCode(UUID.randomUUID().toString().toUpperCase());
            certificateRepository.save(certificate);
        }

        return new AttemptResultResponse(saved.getId(), "EXAM", score,
                exam.getPassingScore(), passed, totalQuestions, correctAnswers);
    }

    // Mark lesson as completed (helper method for the calculation of the course progress)
    public double markLessonAsCompleted(Long courseId, Long lessonId) {
        User student = getLoggedInStudent();

        // Check enrollment and get it
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        // Check lesson exists
        lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // If completed, return current progress
        Optional<CourseProgress> existing = courseProgressRepository
                .findByEnrollmentStudentIdAndEnrollmentCourseIdAndLessonId(
                        student.getId(), courseId, lessonId);

        if (existing.isPresent() && existing.get().isCompleted()) {
                return calculateCurrentProgress(student.getId(), courseId);
        }

        // Mark the lesson as completed
        CourseProgress progress = existing.orElse(new CourseProgress());
        progress.setEnrollment(enrollment);
        progress.setLesson(lessonRepository.findById(lessonId).get());
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());

        // Calculate new percentage
        // how many lessons are completed
        long completedCount = courseProgressRepository
                .findByEnrollmentStudentIdAndEnrollmentCourseId(student.getId(), courseId)
                .stream()
                .filter(CourseProgress::isCompleted)
                .count() + (existing.isPresent() ? 0 : 1);

        int totalLessons = lessonRepository.findByCourseIdOrderByLessonOrder(courseId).size();

        double percentage = totalLessons > 0
                ? (completedCount * 100.0 / totalLessons)
                : 0.0;

        progress.setProgressPercentage(BigDecimal.valueOf(percentage)
                .setScale(2, RoundingMode.HALF_UP));

        courseProgressRepository.save(progress);

        return percentage;
    }

    // View grades and progress
    public StudentProgressResponse getStudentProgress(Long courseId) {
        User student = getLoggedInStudent();

        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        List<QuizScoreResponse> quizScores = quizAttemptRepository
                .findByStudentAndQuizLessonIdOrderBySubmittedAtDesc(student, courseId)
                .stream().map(QuizScoreResponse::fromEntity).collect(Collectors.toList());

        Double averageQuizScore = quizAttemptRepository
                .getAverageQuizScoreByStudentAndCourse(student.getId(), courseId);

        List<ExamScoreResponse> examAttempts = examAttemptRepository
                .findByStudentAndCourseIdOrderByAttemptNumberDesc(student, courseId)
                .stream().map(ExamScoreResponse::fromEntity).collect(Collectors.toList());

        double overallProgress = calculateCurrentProgress(student.getId(), courseId);

        return new StudentProgressResponse(
                course.getTitle(),
                overallProgress,
                averageQuizScore != null ? averageQuizScore : 0.0,
                quizScores,
                examAttempts
        );
}

    // Private helper methods

    private double calculateCurrentProgress(Long studentId, Long courseId) {
    long completedCount = courseProgressRepository
            .findByEnrollmentStudentIdAndEnrollmentCourseId(studentId, courseId)
            .stream()
            .filter(CourseProgress::isCompleted)
            .count();

    int totalLessons = lessonRepository.findByCourseIdOrderByLessonOrder(courseId).size();

    return totalLessons > 0
            ? (completedCount * 100.0 / totalLessons)
            : 0.0;
}

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

