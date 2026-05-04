package com.lms.lms.DTO;

import com.lms.lms.entity.Course;
import com.lms.lms.entity.Lesson;

import java.util.List;
import java.util.stream.Collectors;

public record CourseDetailsResponse(
        Long id,
        String title,
        String description,
        String thumbnailUrl,
        boolean free,
        Integer totalLessons,
        Integer totalDuration,
        String level,
        String instructorName,
        String categoryName,
        boolean published,
        List<LessonSummary> lessons
) {

    public record LessonSummary(
            Long id,
            String title,
            Integer duration,
            Integer lessonOrder,
            boolean preview
    ) {
        public static LessonSummary fromEntity(Lesson lesson) {
            return new LessonSummary(
                    lesson.getId(),
                    lesson.getTitle(),
                    lesson.getDuration(),
                    lesson.getLessonOrder(),
                    lesson.isPreview()
            );
        }
    }

    public static CourseDetailsResponse fromEntity(Course course) {
        List<LessonSummary> lessonList = course.getLessons() != null
                ? course.getLessons().stream()
                        .map(LessonSummary::fromEntity)
                        .collect(Collectors.toList())
                : List.of();

        return new CourseDetailsResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.isFree(),
                course.getTotalLessons(),
                course.getTotalDuration(),
                course.getLevel() != null ? course.getLevel().name() : null,
                course.getInstructor().getFirstName() + " " + course.getInstructor().getLastName(),
                course.getCategory().getName(),
                course.isPublished(),
                lessonList
        );
    }
}