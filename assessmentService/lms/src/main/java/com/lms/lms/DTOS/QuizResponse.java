package com.lms.lms.DTOS;

import com.lms.lms.Entity.Quiz;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public record QuizResponse(
        Long id,
        String title,
        Integer timeLimit,
        Integer totalQuestions,
        BigDecimal passingScore,
        List<QuestionResponse> questions
) {
    public static QuizResponse fromEntity(Quiz quiz) {
        List<QuestionResponse> questionList = quiz.getQuestions() != null
                ? quiz.getQuestions().stream()
                        .map(QuestionResponse::fromEntity)
                        .collect(Collectors.toList())
                : List.of();

        return new QuizResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getTimeLimit(),
                quiz.getTotalQuestions(),
                quiz.getPassingScore(),
                questionList
        );
    }
}
