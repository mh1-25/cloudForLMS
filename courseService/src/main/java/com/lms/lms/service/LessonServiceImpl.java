package com.lms.lms.service;
import com.lms.lms.DTO.LessonRequestDto;
import com.lms.lms.DTO.LessonResponseDto;
import com.lms.lms.entity.Course;
import com.lms.lms.entity.Lesson;
import com.lms.lms.entity.User;
import com.lms.lms.repo.CourseRepository;
import com.lms.lms.repo.LessonRepository;
import com.lms.lms.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl{

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    
    public LessonResponseDto createLesson(LessonRequestDto dto) {

        User instructor =getLoggedInInstructor();

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't own this course");
        }
        if(course.getTotalLessons() != null && course.getTotalLessons() <= course.getLessons().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course has reached maximum number of lessons");
        }

        Lesson lesson = new Lesson();
        lesson.setTitle(dto.getTitle());
        lesson.setDescription(dto.getDescription());
        lesson.setVideoUrl(dto.getVideoUrl());
        lesson.setThumbnailUrl(dto.getThumbnailUrl());
        lesson.setDuration(dto.getDuration());
        lesson.setLessonOrder(dto.getLessonOrder());
        // lesson.setPreview(dto.getPreview());
        lesson.setPreview(dto.getPreview());
        lesson.setCourse(course);
        lesson.getCourse().setInstructor(instructor);

        Lesson saved = lessonRepository.save(lesson);

        LessonResponseDto response = new LessonResponseDto();
        response.setId(saved.getId());
        response.setTitle(saved.getTitle());
        response.setDescription(saved.getDescription());
        response.setVideoUrl(saved.getVideoUrl());
        response.setThumbnailUrl(saved.getThumbnailUrl());
        response.setDuration(saved.getDuration());
        response.setLessonOrder(saved.getLessonOrder());
        // response.setPreview(saved.get());
        response.setPreview(saved.isPreview());
        response.setCourseId(saved.getCourse().getId());
        response.setCreatedAt(saved.getCreatedAt());
        return response;
    }

    
    public LessonResponseDto updateLesson(Long lessonId, Long instructorId, LessonRequestDto dto) {

        User instructor = userRepository.findByRole(User.Role.INSTRUCTOR).stream()
                .filter(u -> u.getId().equals(instructorId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Instructor not found"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        if (!lesson.getCourse().getInstructor().getId().equals(instructor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't own this lesson");
        }

        lesson.setTitle(dto.getTitle());
        lesson.setDescription(dto.getDescription());
        lesson.setVideoUrl(dto.getVideoUrl());
        lesson.setThumbnailUrl(dto.getThumbnailUrl());
        lesson.setDuration(dto.getDuration());
        lesson.setLessonOrder(dto.getLessonOrder());
        lesson.setPreview(dto.getPreview());

        Lesson saved = lessonRepository.save(lesson);

        LessonResponseDto response = new LessonResponseDto();
        response.setId(saved.getId());
        response.setTitle(saved.getTitle());
        response.setDescription(saved.getDescription());
        response.setVideoUrl(saved.getVideoUrl());
        response.setThumbnailUrl(saved.getThumbnailUrl());
        response.setDuration(saved.getDuration());
        response.setLessonOrder(saved.getLessonOrder());
        response.setPreview(saved.isPreview());
        response.setCourseId(saved.getCourse().getId());
        response.setCreatedAt(saved.getCreatedAt());
        return response;
    }

    public void deleteLesson(Long lessonId, Long instructorId) {

        User instructor = userRepository.findByRole(User.Role.INSTRUCTOR).stream()
                .filter(u -> u.getId().equals(instructorId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Instructor not found"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        if (!lesson.getCourse().getInstructor().getId().equals(instructor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't own this lesson");
        }

        lessonRepository.delete(lesson);
    }

    public List<LessonResponseDto> getCourseLessons(Long courseId) {

        courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByLessonOrder(courseId);
        List<LessonResponseDto> result = new ArrayList<>();

        for (Lesson l : lessons) {
            LessonResponseDto response = new LessonResponseDto();
            response.setId(l.getId());
            response.setTitle(l.getTitle());
            response.setDescription(l.getDescription());
            response.setVideoUrl(l.getVideoUrl());
            response.setThumbnailUrl(l.getThumbnailUrl());
            response.setDuration(l.getDuration());
            response.setLessonOrder(l.getLessonOrder());
            response.setPreview(l.isPreview());
            response.setCourseId(l.getCourse().getId());
            response.setCreatedAt(l.getCreatedAt());
            result.add(response);
        }

        return result;
    }
    
    private User getLoggedInInstructor() {
    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated()) {
        throw new RuntimeException("User not authenticated");
    }

    
    boolean isInstructor = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"));

    if (!isInstructor) {
        throw new RuntimeException("Access denied: Not an instructor");
    }

    String email = auth.getName();

    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
}
}