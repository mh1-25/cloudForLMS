package com.lms.lms.Controller;

import com.lms.lms.DTOS.CertificateRequestDto;
import com.lms.lms.DTOS.CertificateResponse;
import com.lms.lms.Services.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor

public class CertificateController {


    private final CertificateService certificateService;

    // @PostMapping("/generate/{courseId}")
    // @PreAuthorize("hasRole('INSTRUCTOR')")
    // public ResponseEntity<CertificateResponse> generateCertificate(
    //         @RequestBody Long courseId,
    //         @RequestBody CertificateRequestDto requestDto) {
    //     return ResponseEntity.ok(certificateService.generateCertificateForCourseCompletion(requestDto,  courseId));
    // }
    
    // View certificates
    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CertificateResponse>> getMyCertificates() {
        return ResponseEntity.ok(certificateService.getMyCertificates());
    }
}