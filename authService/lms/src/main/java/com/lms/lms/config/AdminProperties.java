package com.lms.lms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "admin")
public class AdminProperties {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}