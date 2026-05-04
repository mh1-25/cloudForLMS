package com.lms.lms.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
@Data
public class CourseResponseDto {
    private Long id;
    private Long instructorId;
    private String instructorName;
    private String title;
    private String description;
    private String thumbnailUrl;
    private Boolean free;
    private Boolean published;
    private Integer totalLessons;
    private Integer totalDuration;
    private Long categoryId;
    private LocalDateTime createdAt;
    private List<LessonResponseDto> lessons;
}
