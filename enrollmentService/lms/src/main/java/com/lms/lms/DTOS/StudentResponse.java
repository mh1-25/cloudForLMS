package com.lms.lms.DTOS;

import com.lms.lms.Entity.User;

public record StudentResponse(
    Long studentId,
    String firstName,
    String lastName,
    String email
) {
    public static StudentResponse fromEntity(User user) {
        return new StudentResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail()
        );
    }
}
    

