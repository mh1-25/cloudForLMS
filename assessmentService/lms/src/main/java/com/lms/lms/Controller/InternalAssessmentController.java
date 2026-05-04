package com.lms.lms.Controller;

import com.lms.lms.DTOS.ExamScoreResponse;
import com.lms.lms.DTOS.QuizScoreResponse;
import com.lms.lms.Entity.ExamAttempt;
import com.lms.lms.Entity.QuizAttempt;
import com.lms.lms.Entity.User;
import com.lms.lms.Repo.ExamAttemptRepository;
import com.lms.lms.Repo.QuizAttemptRepository;
import com.lms.lms.Repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/internal/assessments")
@RequiredArgsConstructor
public class InternalAssessmentController {

    private final QuizAttemptRepository quizAttemptRepository;
    private final ExamAttemptRepository examAttemptRepository;
    private final UserRepository userRepository;

    @GetMapping("/quiz-scores")
    public List<QuizScoreResponse> getQuizScores(@RequestParam Long studentId,
                                                 @RequestParam Long lessonId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return quizAttemptRepository
                .findByStudentAndQuizLessonIdOrderBySubmittedAtDesc(student, lessonId)
                .stream()
                .map(QuizScoreResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/exam-scores")
    public List<ExamScoreResponse> getExamScores(@RequestParam Long studentId,
                                                 @RequestParam Long courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return examAttemptRepository
                .findByStudentAndCourseIdOrderByAttemptNumberDesc(student, courseId)
                .stream()
                .map(ExamScoreResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/avg-quiz-score")
    public Double getAvgQuizScore(@RequestParam Long studentId,
                                  @RequestParam Long courseId) {
        Double avg = quizAttemptRepository.getAverageQuizScoreByStudentAndCourse(studentId, courseId);
        return avg != null ? avg : 0.0;
    }
}
