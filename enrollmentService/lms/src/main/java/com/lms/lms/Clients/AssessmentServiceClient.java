package com.lms.lms.Clients;

import com.lms.lms.Clients.dto.ExamScoreDto;
import com.lms.lms.Clients.dto.QuizScoreDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "assessment-service", url = "${services.assessment-service.url}")
public interface AssessmentServiceClient {

    @GetMapping("/api/internal/assessments/quiz-scores")
    List<QuizScoreDto> getQuizScores(@RequestParam("studentId") Long studentId,
                                     @RequestParam("lessonId") Long lessonId);

    @GetMapping("/api/internal/assessments/exam-scores")
    List<ExamScoreDto> getExamScores(@RequestParam("studentId") Long studentId,
                                     @RequestParam("courseId") Long courseId);

    @GetMapping("/api/internal/assessments/avg-quiz-score")
    Double getAvgQuizScore(@RequestParam("studentId") Long studentId,
                           @RequestParam("courseId") Long courseId);
}
