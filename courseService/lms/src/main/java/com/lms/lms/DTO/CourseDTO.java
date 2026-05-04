package com.lms.lms.DTO;

import com.lms.lms.entity.Course;

public record CourseDTO(
        Long id,
        String title,
        String description,
        String thumbnailUrl,
        boolean free,
        Integer totalLessons,
        Integer totalDuration,
        String level,
        String instructorName,
        String categoryName
) {
    public static CourseDTO fromEntity(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.isFree(),
                course.getTotalLessons(),
                course.getTotalDuration(),
                course.getLevel() != null ? course.getLevel().name() : null,
                course.getInstructor().getFirstName() + " " + course.getInstructor().getLastName(),
                course.getCategory().getName()
        );
    }
}