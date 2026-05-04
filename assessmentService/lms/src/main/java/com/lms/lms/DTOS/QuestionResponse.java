package com.lms.lms.DTOS;

import com.lms.lms.Entity.Question;
import java.util.List;
import java.util.stream.Collectors;

public record QuestionResponse(
        Long id,
        String questionText,
        String questionType,
        Integer questionOrder,
        List<AnswerOptionResponse> answers
) {
    public static QuestionResponse fromEntity(Question question) {
        List<AnswerOptionResponse> answerOptions = question.getAnswers() != null
                ? question.getAnswers().stream()
                        .map(AnswerOptionResponse::fromEntity)
                        .collect(Collectors.toList())
                : List.of();

        return new QuestionResponse(
                question.getId(),
                question.getQuestionText(),
                question.getQuestionType().name(),
                question.getQuestionOrder(),
                answerOptions
        );
    }
}
