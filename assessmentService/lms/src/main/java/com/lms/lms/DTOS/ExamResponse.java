package com.lms.lms.DTOS;

import com.lms.lms.Entity.CourseExam;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public record ExamResponse(
        Long id,
        String title,
        Integer timeLimit,
        Integer totalQuestions,
        BigDecimal passingScore,
        Integer maxAttempts,
        List<QuestionResponse> questions
) {
    public static ExamResponse fromEntity(CourseExam exam) {
        List<QuestionResponse> questionList = exam.getQuestions() != null
                ? exam.getQuestions().stream()
                        .map(QuestionResponse::fromEntity)
                        .collect(Collectors.toList())
                : List.of();

        return new ExamResponse(
                exam.getId(),
                exam.getTitle(),
                exam.getTimeLimit(),
                exam.getTotalQuestions(),
                exam.getPassingScore(),
                exam.getMaxAttempts(),
                questionList
        );
    }
}
