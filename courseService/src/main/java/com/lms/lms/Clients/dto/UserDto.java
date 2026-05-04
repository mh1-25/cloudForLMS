package com.lms.lms.Clients.dto;

public record UserDto(
        Long id,
        String email,
        String firstname,
        String lastname,
        String role,
        boolean active
) {}
