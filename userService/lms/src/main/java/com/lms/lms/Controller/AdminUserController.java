package com.lms.lms.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.lms.DTOS.CreateUserRequest;
import com.lms.lms.DTOS.UpdateRoleRequest;
import com.lms.lms.DTOS.UserRespones;
import com.lms.lms.Entity.User;
import com.lms.lms.Services.AdminUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @PostMapping("/CreateUser")
    public void createUser(@RequestBody CreateUserRequest request) {
        adminUserService.createUser(request);
    }

    @GetMapping
    public List<UserRespones> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    @GetMapping("/students")
    public List<UserRespones> getStudents() {
        return adminUserService.getStudents();
    }

    @GetMapping("/instructors")
    public List<UserRespones> getInstructors() {
        return adminUserService.getInstructors();
    }

    @PutMapping("/block/{id}")
    public void block(@PathVariable Long id) {
        adminUserService.blockUser(id);
    }

    @PutMapping("/unblock/{id}")

    public void unblock(@PathVariable Long id) {
        adminUserService.unblockUser(id);
    }

    @DeleteMapping("/delete/{id}")

    public void delete(@PathVariable Long id) {
        adminUserService.deleteUser(id);
    }

    @PutMapping("/role/{id}")
    public void changeRole(@PathVariable Long id,
            @RequestBody UpdateRoleRequest request) {
        adminUserService.changeRole(id, User.Role.valueOf(request.role()));
    }
    
}