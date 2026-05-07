package com.lms.lms.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.lms.lms.Entity.User;
import com.lms.lms.Repo.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProperties;   // ← inject here

    @Bean
    public ApplicationRunner initAdmin() {
        return args -> {
            log.info("[DATA-INIT] Checking if admin user exists for email: {}", 
                     adminProperties.getEmail());

            boolean exists = userRepository
                    .findByEmail(adminProperties.getEmail())
                    .isPresent();

            if (!exists) {
                User admin = new User();
                admin.setEmail(adminProperties.getEmail());
                admin.setPassword(passwordEncoder.encode(adminProperties.getPassword()));
                admin.setFirstName(adminProperties.getFirstName());
                admin.setLastName(adminProperties.getLastName());
                admin.setRole(User.Role.ADMIN);
                admin.setActive(true);

                userRepository.save(admin);

                log.info("[DATA-INIT] Admin user created successfully: {}", 
                         adminProperties.getEmail());
            } else {
                log.info("[DATA-INIT] Admin user already exists, skipping creation.");
            }
        };
    }
}