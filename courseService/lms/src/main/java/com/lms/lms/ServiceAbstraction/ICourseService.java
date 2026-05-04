package com.lms.lms.ServiceAbstraction;
import com.lms.lms.DTO.CourseRequestDto;
import com.lms.lms.DTO.CourseResponseDto;


import java.util.List;

public interface ICourseService {
    
    CourseResponseDto createCourse(CourseRequestDto dto);
    CourseResponseDto updateCourse(Long courseId, CourseRequestDto dto);
    void deleteCourse(Long courseId, Long instructorId);
    List<CourseResponseDto> getInstructorCourses(Long instructorId);
    CourseResponseDto getCourseById(Long courseId);
}
