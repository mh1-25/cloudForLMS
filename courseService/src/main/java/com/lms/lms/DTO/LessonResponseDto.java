package com.lms.lms.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LessonResponseDto {
    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Integer duration;
    private Integer lessonOrder;
    private Boolean Preview;
    private Long courseId;
    private LocalDateTime createdAt;
}
