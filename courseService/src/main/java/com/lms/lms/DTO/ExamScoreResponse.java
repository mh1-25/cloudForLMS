package com.lms.lms.DTO;

import com.lms.lms.entity.ExamAttempt;
import java.math.BigDecimal;

public record ExamScoreResponse(
        Long attemptId,
        Integer attemptNumber,
        BigDecimal score,
        BigDecimal passingScore,
        boolean passed
) {
    public static ExamScoreResponse fromEntity(ExamAttempt attempt) {
        return new ExamScoreResponse(
                attempt.getId(),
                attempt.getAttemptNumber(),
                attempt.getScore(),
                attempt.getCourseExam().getPassingScore(),
                attempt.isPassed()
        );
    }
}
