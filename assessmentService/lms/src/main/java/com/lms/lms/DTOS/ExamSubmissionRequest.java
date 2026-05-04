package com.lms.lms.DTOS;

import java.util.List;

// The full exam submission — student sends courseId + all their answers
public record ExamSubmissionRequest(
        Long courseId,
        List<AnswerSubmission> answers
) {}
