package com.lms.lms.DTO;

import java.util.List;

public record StudentProgressResponse(
        String courseTitle,
        Double overallProgressPercentage,
        Double averageQuizScore,
        List<QuizScoreResponse> quizScores,
        List<ExamScoreResponse> examAttempts
) {}
