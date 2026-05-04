package com.lms.lms.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lms.lms.DTO.CourseDTO;
import com.lms.lms.DTO.CourseDetailsResponse;
import com.lms.lms.DTO.CourseRequestDto;
import com.lms.lms.DTO.CourseResponseDto;
import com.lms.lms.repo.UserRepository;


import com.lms.lms.ServiceAbstraction.ICourseService;
import com.lms.lms.service.CourseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")

@RequiredArgsConstructor
public class CourseController {

    private final ICourseService courseService;
    private final UserRepository userRepository;

    @PostMapping("/createcourses")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseResponseDto> createCourse(
        @RequestBody CourseRequestDto dto) {
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(courseService.createCourse(dto));
    }

    @PutMapping("/updatecourses/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseResponseDto> updateCourse(
            @PathVariable Long courseId,
            @RequestBody CourseRequestDto dto
            ) {
        return ResponseEntity.ok(courseService.updateCourse(courseId, dto));
    }

    @DeleteMapping("/{courseId}/{currentUser}")
    @PreAuthorize("hasRole('INSTRUCTOR')")

    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long courseId,
            @PathVariable Long currentUser) {
        courseService.deleteCourse(courseId, currentUser);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/my-courses/{currentUser}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<CourseResponseDto>> getMycourses(
            @PathVariable Long currentUser) {
        return ResponseEntity.ok(courseService.getInstructorCourses(currentUser));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseResponseDto> getCourseById(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseService.getCourseById(courseId));
    }

    //=================
    // Student related
    //=================

    // Browse all available courses
    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseDTO>> browseAvailableCourses() {
        return ResponseEntity.ok(((CourseService) courseService).browseAvailableCourses());
    }

    // Search courses by name / category
    @GetMapping("/search")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseDTO>> searchCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(((CourseService) courseService).searchCourses(keyword, categoryId));
    }


    // Watch video lectures
    @GetMapping("/{courseId}/lessons/{lessonId}/watch")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> watchLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(((CourseService) courseService).watchLesson(courseId, lessonId));
    }

    // get full course details
    @GetMapping("/{courseId}/details")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CourseDetailsResponse> getCourseDetails(@PathVariable Long courseId) {
        return ResponseEntity.ok(((CourseService) courseService).getCourseDetails(courseId));
    }

}