package com.lms.lms.DTOS;

// import io.smallrye.common.constraint.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;



public record LoginRequest(
    @NotBlank
    @NotNull
    String email,
    @NotBlank
    @NotNull
    String password) 
      {
    
}
