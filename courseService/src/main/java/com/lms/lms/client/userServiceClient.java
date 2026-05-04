package com.lms.lms.client;

import com.lms.lms.entity.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "user-service", url = "http://localhost:8080")
public interface userServiceClient {

    @GetMapping("/api/admin/users/email")
    User getUserById(@RequestParam String email);
}
