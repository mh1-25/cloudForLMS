package com.lms.lms.DTOS;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CertificateRequestDto {
    private Long studentId;
    private Long courseId;
    private String certificateCode;
    private BigDecimal finalScore;
    private Boolean valid;

}
