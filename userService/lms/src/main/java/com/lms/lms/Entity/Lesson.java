package com.lms.lms.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;




@Entity
@Data
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;
    
    @Column(nullable = false)
    private Integer duration;
    
    @Column(name = "lesson_order", nullable = false)
    private Integer lessonOrder;
    
    @Column(name = "is_preview")
    private boolean preview = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<Quiz> quizzes = new ArrayList<>();
}