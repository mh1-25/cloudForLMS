package com.lms.lms.DTOS;

import java.util.List;

public record StudentProgressResponse(
        String courseTitle,
        Double overallProgressPercentage,
        Double averageQuizScore,
        List<QuizScoreResponse> quizScores,
        List<ExamScoreResponse> examAttempts
) {}
