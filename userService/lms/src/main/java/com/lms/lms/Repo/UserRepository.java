package com.lms.lms.Repo;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lms.lms.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.active = true AND u.role = 'STUDENT'")
    List<User> findActiveStudents();
    @Query("SELECT u FROM User u WHERE u.active = true AND u.role = 'INSTRUCTOR'")
    List<User> findActiveInstructors();
}