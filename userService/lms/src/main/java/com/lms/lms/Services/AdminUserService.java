package com.lms.lms.Services;

import com.lms.lms.DTOS.CreateUserRequest;
import com.lms.lms.DTOS.UserRespones;
import com.lms.lms.Entity.User;
import com.lms.lms.Repo.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder PasswordEncoder;  
    
    
   public List<UserRespones> getAllUsers() {

    return userRepository.findAll()
            .stream()
            .filter(user -> user.getRole() != User.Role.ADMIN)
            .map(user -> new UserRespones(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRole().name(),
                    user.isActive()
            ))
            .toList();
}

    public List<UserRespones> getStudents() {
        return userRepository.findByRole(User.Role.STUDENT).stream()
                .map(
                    user -> new UserRespones(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole().name(),
                        user.isActive()
                    )
                ).toList();
    }

    public List<UserRespones> getInstructors() {
        return userRepository.findByRole(User.Role.INSTRUCTOR).stream()
                .map(
                    user -> new UserRespones(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole().name(),
                        user.isActive()
                    )
                ).toList();
    }

  
    public void blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        userRepository.save(user);
    }

    public void unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(true);
        userRepository.save(user);
    }

  
   
    
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }


public void  createUser(CreateUserRequest request) {

    if (userRepository.findByEmail(request.email()).isPresent()) {
        throw new RuntimeException("User already exists");
    }

    User user = new User();
    user.setEmail(request.email());
    user.setPassword(PasswordEncoder.encode(request.password()));
    user.setFirstName(request.firstname());
    user.setLastName(request.lastname());
    user.setRole(request.role());
    user.setActive(true);

    userRepository.save(user);

  
}
    public void changeRole(Long userId, User.Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);
        userRepository.save(user);
    }


    public void approveInstructor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.INSTRUCTOR) {
            user.setActive(true);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User is not instructor");
        }
    }

    
    public Long totalUsers() {
        return userRepository.count();
    }

    public Long activeStudentsCount() {
        return (long) userRepository.findActiveStudents().size();
    }

    public Long instructorsCount() {
        return userRepository.findByRole(User.Role.INSTRUCTOR).stream().count();
    }
}