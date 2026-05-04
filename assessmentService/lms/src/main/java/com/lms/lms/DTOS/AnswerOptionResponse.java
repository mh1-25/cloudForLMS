package com.lms.lms.DTOS;

import com.lms.lms.Entity.Answer;


public record AnswerOptionResponse(
        Long id,
        String answerText,
        Integer answerOrder
) {
    public static AnswerOptionResponse fromEntity(Answer answer) {
        return new AnswerOptionResponse(
                answer.getId(),
                answer.getAnswerText(),
                answer.getAnswerOrder()
        );
    }
}
