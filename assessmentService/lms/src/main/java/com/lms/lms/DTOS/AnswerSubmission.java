package com.lms.lms.DTOS;



// Represents one answer the student picks for one question
public record AnswerSubmission(
        Long questionId,
        Long selectedAnswerId
) {}
