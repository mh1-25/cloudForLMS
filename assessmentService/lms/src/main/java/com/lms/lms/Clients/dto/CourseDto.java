package com.lms.lms.Clients.dto;

public record CourseDto(
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
) {}
