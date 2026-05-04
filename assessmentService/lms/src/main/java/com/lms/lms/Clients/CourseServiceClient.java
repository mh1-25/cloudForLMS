package com.lms.lms.Clients;

import com.lms.lms.Clients.dto.CourseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "course-service", url = "${services.course-service.url}")
public interface CourseServiceClient {

    @GetMapping("/api/internal/courses/{id}")
    CourseDto getById(@PathVariable("id") Long id);

    @GetMapping("/api/internal/courses/{id}/instructor-id")
    Long getInstructorId(@PathVariable("id") Long id);

    @GetMapping("/api/internal/courses/lessons/{lessonId}/exists")
    boolean lessonExists(@PathVariable("lessonId") Long lessonId);

    @GetMapping("/api/internal/courses/lessons/{lessonId}/course-id")
    Long getLessonCourseId(@PathVariable("lessonId") Long lessonId);
}
