package com.lms.lms.Controller;

import com.lms.lms.DTOS.LessonRequestDto;
import com.lms.lms.DTOS.LessonResponseDto;
import com.lms.lms.Services.LessonServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonServiceImpl lessonService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<LessonResponseDto> createLesson(
            // @PathVariable Long courseId,
            @RequestBody LessonRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lessonService.createLesson( dto));
    }

    @PutMapping("/update/{lessonId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<LessonResponseDto> updateLesson(
            @PathVariable Long lessonId,
            @RequestParam Long instructorId,
            @RequestBody LessonRequestDto dto) {
        return ResponseEntity.ok(lessonService.updateLesson(lessonId, instructorId, dto));
    }

    @DeleteMapping("/delete/{lessonId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long lessonId,
            @RequestParam Long instructorId) {
        lessonService.deleteLesson(lessonId, instructorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('STUDENT')") // Both instructors and students can view lessons
    public ResponseEntity<List<LessonResponseDto>> getCourseLessons(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getCourseLessons(courseId));
    }
}