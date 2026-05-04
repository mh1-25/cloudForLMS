package com.lms.lms.Repo;

import com.lms.lms.Entity.Certificate;
import com.lms.lms.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateCode(String code);
    List<Certificate> findByStudent(User student);
    List<Certificate> findByCourseId(Long courseId);
}