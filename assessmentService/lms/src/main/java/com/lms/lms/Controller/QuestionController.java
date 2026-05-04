package com.lms.lms.Controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.lms.DTOS.AnswerOptionResponse;
import com.lms.lms.DTOS.AnswerRequestDto;
import com.lms.lms.DTOS.QuestionRequestDto;
import com.lms.lms.DTOS.QuestionResponse;
import com.lms.lms.Services.QuistionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuistionService QuestionService;
    @PostMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<QuestionResponse> addQuizQuestion(
        @PathVariable Long quizId,
        @RequestBody QuestionRequestDto dto) {
    return ResponseEntity.ok(QuestionService.addQuestionQuiz(quizId, dto));
    }
    @DeleteMapping("/quizzes/{quizId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuizQuestion(
        @PathVariable Long quizId,
        @PathVariable Long questionId) {
    QuestionService.deleteQuestionFromQuiz(quizId, questionId);
    return ResponseEntity.noContent().build();
}

    // Exam questions
    @PostMapping("/exams/{examId}/questions")
    public ResponseEntity<QuestionResponse> addExamQuestion(
        @PathVariable Long examId,
        @RequestBody QuestionRequestDto dto) {
    return ResponseEntity.ok(QuestionService.addQuestionToExam(examId, dto));
}

    @DeleteMapping("/exams/{examId}/questions/{questionId}")
    public ResponseEntity<Void> deleteExamQuestion(
        @PathVariable Long examId,
        @PathVariable Long questionId) {
    QuestionService.deleteQuestionForExam(examId, questionId);
    return ResponseEntity.noContent().build();
}
    @PutMapping("/questions/{questionId}/answers/{answerId}")
    public ResponseEntity<AnswerOptionResponse> updateAnswer(
        @PathVariable Long questionId,
        @PathVariable Long answerId,
        @RequestBody AnswerRequestDto dto) {
    return ResponseEntity.ok(QuestionService.updateAnswer(questionId, answerId, dto));
}
    @DeleteMapping("/questions/{questionId}/answers/{answerId}")
    public ResponseEntity<Void> deleteAnswer(
        @PathVariable Long questionId,
        @PathVariable Long answerId) {
    QuestionService.deleteAnswer(questionId, answerId);
    return ResponseEntity.noContent().build();
}

    @GetMapping("/{questionId}/answers")
    public ResponseEntity<List<AnswerOptionResponse>> getAnswers(
        @PathVariable Long questionId) {
    return ResponseEntity.ok(QuestionService.getAnswersByQuestion(questionId));
}

    @PostMapping("/{questionId}/answers")
    public ResponseEntity<AnswerOptionResponse> addAnswer(
        @PathVariable Long questionId,
        @RequestBody AnswerRequestDto dto) {
    return ResponseEntity.ok(QuestionService.addAnswerToQuestion(questionId, dto));
}
}
