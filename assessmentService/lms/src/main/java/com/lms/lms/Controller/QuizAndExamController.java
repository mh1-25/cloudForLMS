package com.lms.lms.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.lms.lms.DTOS.AttemptResultResponse;
import com.lms.lms.DTOS.ExamRequestDto;
import com.lms.lms.DTOS.ExamResponse;
import com.lms.lms.DTOS.ExamSubmissionRequest;

import com.lms.lms.DTOS.StudentProgressResponse;
import com.lms.lms.Services.QuizAndExamService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/quizzes-exams")
@RequiredArgsConstructor

public class QuizAndExamController {
        private final QuizAndExamService quizAndExamService;
        
    

      // Take lesson quiz (fetch)
    

   
    @PostMapping("/create-exam")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ExamResponse> CreateExam(
        @RequestBody  ExamRequestDto dto) {
        return ResponseEntity.ok(quizAndExamService.CreateExam(dto));
    }
    // Take final course exam (fetch)
    @GetMapping("/courses/{courseId}/exam")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ExamResponse> getCourseExam(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizAndExamService.getCourseExam(courseId));
    }

    @DeleteMapping("/delete-exam/{examId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deleteExam(@PathVariable Long examId) {
        quizAndExamService.deleteExam(examId);
        return ResponseEntity.noContent().build();
    }

    // Take final course exam (submit)
    @PostMapping("/courses/{courseId}/exam/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AttemptResultResponse> submitCourseExam(
            @PathVariable Long courseId,
            @RequestBody ExamSubmissionRequest request) {
        return ResponseEntity.ok(quizAndExamService.submitCourseExam(request));
    }

    // View grades and progress
    @GetMapping("/courses/{courseId}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProgressResponse> getStudentProgress(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(quizAndExamService.getStudentProgress(courseId));
    }

    // Mark lesson as completed (helper method for the calculation of the course progress)
    @PostMapping("/courses/{courseId}/lessons/{lessonId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Double> markLessonAsCompleted(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {
        double progress = quizAndExamService.markLessonAsCompleted(courseId, lessonId);
        return ResponseEntity.ok(progress);
    }

    // Quiz questions




   

}
