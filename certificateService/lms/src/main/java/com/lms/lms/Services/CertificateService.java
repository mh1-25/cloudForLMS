package com.lms.lms.Services;

import com.lms.lms.DTOS.CertificateRequestDto;
import com.lms.lms.DTOS.CertificateResponse;
import com.lms.lms.Entity.Certificate;
import com.lms.lms.Entity.Course;
import com.lms.lms.Entity.User;
import com.lms.lms.Repo.CertificateRepository;
import com.lms.lms.Repo.CourseRepository;
import com.lms.lms.Repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    // public CertificateResponse generateCertificateForCourseCompletion(CertificateRequestDto requestDto, Long courseId) {
      
    //     User instructor = getLoggedInInstructor();
    //     User student = getLoggedInStudent();
    //     Course course = courseRepository.findById(courseId)
    //             .orElseThrow(() -> new RuntimeException("Course not found"));
        
    //     Certificate certificate = new Certificate();
    //     certificate.setStudent(student);
    //     certificate.setCourse(course);
    //     certificate.getCourse().setInstructor(instructor);
    //     certificate.setCertificateCode("http://example.com/certificates/" + student.getId() + "_" + courseId + ".pdf");

    //     var savedCertificate = certificateRepository.save(certificate);

    //     return CertificateResponse.fromEntity(savedCertificate);
    // }
    // View certificates
    public List<CertificateResponse> getMyCertificates() {
        User student = getLoggedInStudent();

        return certificateRepository.findByStudent(student)
                .stream()
                .map(CertificateResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private User getLoggedInStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    private User getLoggedInInstructor() {
    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated()) {
        throw new RuntimeException("User not authenticated");
    }

    
    boolean isInstructor = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"));

    if (!isInstructor) {
        throw new RuntimeException("Access denied: Not an instructor");
    }

    String email = auth.getName();

    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
}
}