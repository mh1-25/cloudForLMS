package com.lms.lms.Controller;

import com.lms.lms.Services.AdminUserService;
import com.lms.lms.DTOS.UserRespones;
import com.lms.lms.DTOS.CreateUserRequest;
import com.lms.lms.DTOS.UpdateRoleRequest;
import com.lms.lms.Entity.User;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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