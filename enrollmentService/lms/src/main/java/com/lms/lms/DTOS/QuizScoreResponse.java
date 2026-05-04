package com.lms.lms.DTOS;

import com.lms.lms.Entity.QuizAttempt;
import java.math.BigDecimal;

public record QuizScoreResponse(
        Long attemptId,
        String quizTitle,
        String lessonTitle,
        BigDecimal score,
        BigDecimal passingScore,
        String status
) {
    public static QuizScoreResponse fromEntity(QuizAttempt attempt) {
        return new QuizScoreResponse(
                attempt.getId(),
                attempt.getQuiz().getTitle(),
                attempt.getQuiz().getLesson().getTitle(),
                attempt.getScore(),
                attempt.getQuiz().getPassingScore(),
                attempt.getStatus().name()
        );
    }
}
