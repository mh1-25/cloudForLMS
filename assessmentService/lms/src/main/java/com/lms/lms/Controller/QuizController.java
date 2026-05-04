package com.lms.lms.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.lms.DTOS.AttemptResultResponse;
import com.lms.lms.DTOS.QuizRequestDto;
import com.lms.lms.DTOS.QuizResponse;
import com.lms.lms.DTOS.QuizResponseDto;
import com.lms.lms.DTOS.QuizSubmissionRequest;
import com.lms.lms.Services.QuizAndExamService;
import com.lms.lms.Services.QuizService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;
    @PostMapping("/create-quiz")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<QuizResponse> createQuiz(
        @RequestBody QuizRequestDto dto) {
        return ResponseEntity.ok(quizService.CreeateQuiz(dto));
    }

    @DeleteMapping("/delete-quiz/{quizId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
        quizService.DeleteQuiz(quizId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses/{courseId}/lessons/{lessonId}/quiz")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<QuizResponse> getLessonQuiz(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(quizService.getLessonQuiz(courseId, lessonId));
    }

     // Take lesson quiz (submit)
    @PostMapping("/courses/{courseId}/quiz/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AttemptResultResponse> submitLessonQuiz(
            @PathVariable Long courseId,
            @RequestBody QuizSubmissionRequest request) {
        return ResponseEntity.ok(quizService.submitLessonQuiz(courseId, request));
    }

}
