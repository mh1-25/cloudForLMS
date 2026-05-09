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

    private final AdminProperties adminProperties;

    @Bean
    public ApplicationRunner initAdmin() {

        return args -> {

            User admin = userRepository
                    .findByEmail(adminProperties.getEmail())
                    .orElse(null);

            if (admin == null) {

                admin = new User();

                admin.setEmail(adminProperties.getEmail());

                log.info("[DATA-INIT] Creating admin user...");
            } else {

                log.info("[DATA-INIT] Admin already exists, updating data...");
            }

            admin.setFirstName(adminProperties.getFirstName());

            admin.setLastName(adminProperties.getLastName());

            admin.setPassword(
                    passwordEncoder.encode(adminProperties.getPassword())
            );

            admin.setRole(User.Role.ADMIN);

            admin.setActive(true);

            userRepository.save(admin);

            log.info("[DATA-INIT] Admin initialized successfully");
        };
    }
}