package com.lms.lms.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {
    
    @Id  // ✅ Single ID بسيط!
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt = LocalDateTime.now();
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ENROLLED;
    
    // ✅ Unique Constraint (بدل Composite Key)
    @Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "course_id"})
    })
    
    public enum Status {
        ENROLLED, COMPLETED, DROPPED
    }
    
    // ✅ Helper methods
    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }
    
    public Long getCourseId() {
        return course != null ? course.getId() : null;
    }
}