package com.lms.lms.DTOS;

// import io.smallrye.common.constraint.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;



public record LoginRequest(
    @NotBlank // OCL - Validation annotations to ensure email and password are not null or blank
    @NotNull // OCL - Validation annotations to ensure email and password are not null or blank
    String email,
    @NotBlank // OCL - Validation annotations to ensure email and password are not null or blank
    @NotNull // OCL - Validation annotations to ensure email and password are not null or blank
    String password) 
      {
    
}
