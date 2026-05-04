package com.lms.lms.DTOS;

import com.lms.lms.Entity.Certificate;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CertificateResponse(
        Long id,
        String certificateCode,
        String courseTitle,
        String studentName,
        BigDecimal finalScore,
        LocalDateTime issuedAt,
        boolean valid
) {
    public static CertificateResponse fromEntity(Certificate certificate) {
        return new CertificateResponse(
                certificate.getId(),
                certificate.getCertificateCode(),
                certificate.getCourse().getTitle(),
                certificate.getStudent().getFirstName() + " " + certificate.getStudent().getLastName(),
                certificate.getFinalScore(),
                certificate.getIssuedAt(),
                certificate.isValid()
        );
    }
}
