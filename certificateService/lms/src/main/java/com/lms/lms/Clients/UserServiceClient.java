package com.lms.lms.Clients;

import com.lms.lms.Clients.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", url = "${services.user-service.url}")
public interface UserServiceClient {

    @GetMapping("/api/internal/users/{id}")
    UserDto getById(@PathVariable("id") Long id);

    @GetMapping("/api/internal/users/by-email")
    UserDto getByEmail(@RequestParam("email") String email);
}
