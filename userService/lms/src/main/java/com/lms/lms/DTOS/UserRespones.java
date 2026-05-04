package com.lms.lms.DTOS;

public record UserRespones(
    
    Long id,
    String email,
    String firstname,
    String lastname,
    String role,
    boolean active

) {
    
}
