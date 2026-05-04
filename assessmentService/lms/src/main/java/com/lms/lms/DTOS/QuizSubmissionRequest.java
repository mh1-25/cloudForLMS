package com.lms.lms.DTOS;

import java.util.List;

// The full quiz submission — student sends quizId + all their answers
public record QuizSubmissionRequest(
        Long quizId,
        List<AnswerSubmission> answers
) {}
