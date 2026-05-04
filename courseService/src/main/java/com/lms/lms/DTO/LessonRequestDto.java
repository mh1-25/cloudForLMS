package com.lms.lms.DTO;
import lombok.Data;

@Data
public class LessonRequestDto {
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Integer duration;
    private Integer lessonOrder;
    // private Long instructor;
    private Boolean Preview;
    private Long courseId;
}