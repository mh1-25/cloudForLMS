package com.lms.lms.DTOS;
import java.time.LocalDateTime;

public record ErrorResponse(
        String message,
        int status,
        LocalDateTime timestamp,
        String path
) {}