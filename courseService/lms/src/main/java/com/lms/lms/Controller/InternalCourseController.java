package com.lms.lms.Controller;

import com.lms.lms.DTO.CourseDTO;
import com.lms.lms.entity.Course;
import com.lms.lms.entity.Lesson;
import com.lms.lms.repo.CourseRepository;
import com.lms.lms.repo.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internal/courses")
@RequiredArgsConstructor
public class InternalCourseController {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(CourseDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/published")
    public boolean isPublished(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(Course::isPublished)
                .orElse(false);
    }

    @GetMapping("/{id}/instructor-id")
    public ResponseEntity<Long> getInstructorId(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(c -> c.getInstructor().getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lessons/{lessonId}/exists")
    public boolean lessonExists(@PathVariable Long lessonId) {
        return lessonRepository.findById(lessonId).isPresent();
    }

    @GetMapping("/lessons/{lessonId}/course-id")
    public ResponseEntity<Long> getLessonCourseId(@PathVariable Long lessonId) {
        return lessonRepository.findById(lessonId)
                .map(Lesson::getCourse)
                .map(Course::getId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
