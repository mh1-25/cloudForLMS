package com.lms.lms.Clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "enrollment-service", url = "${services.enrollment-service.url}")
public interface EnrollmentServiceClient {

    @GetMapping("/api/internal/enrollments/exists")
    boolean exists(@RequestParam("studentId") Long studentId,
                   @RequestParam("courseId") Long courseId);
}
