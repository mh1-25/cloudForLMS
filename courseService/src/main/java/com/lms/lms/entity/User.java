package com.lms.lms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor 
@AllArgsConstructor

public class User implements UserDetails {



    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @Email
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, name = "first_name")
    private String firstName;
    
    @Column(nullable = false, name = "last_name")
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.STUDENT;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "is_active")
    private boolean active = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "student")
    private List<Enrollment> enrollments;
    
    @OneToMany(mappedBy = "instructor")
    private List<Course> courses;
    
    public enum Role { STUDENT, INSTRUCTOR, ADMIN }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
     {

        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
     }

    @Override
    public String getUsername() {
        return email;
    }
}