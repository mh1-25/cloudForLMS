package com.lms.lms.DTOS;


public record AnswerRequestDto(
    String answerText,
    boolean correct,
    Integer answerOrder
) {}