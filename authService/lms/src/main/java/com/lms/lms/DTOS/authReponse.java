package com.lms.lms.DTOS;

public record authReponse(
    Long id,
    String firstname,
    String lastname,
    String email,
    String role,
    String message, 
    String token

) {

}
