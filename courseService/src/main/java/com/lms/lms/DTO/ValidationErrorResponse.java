package com.lms.lms.DTO;

import java.time.LocalDateTime;
import java.util.Map;

public record ValidationErrorResponse(
        String message,
        int status,
        LocalDateTime timestamp,
        String path,
        Map<String, String> errors
) {}