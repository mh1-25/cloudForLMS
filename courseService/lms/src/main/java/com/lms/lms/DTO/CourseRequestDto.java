package com.lms.lms.DTO;

import java.math.BigDecimal;

import lombok.Data;
@Data
public class CourseRequestDto {
    private String title;
    private String description;
    private String thumbnailUrl;
    private Boolean free;
    private Boolean published;
    private Integer totalLessons;
    private Integer totalDuration;
    private Long categoryId;
    // private Long instructor;
}