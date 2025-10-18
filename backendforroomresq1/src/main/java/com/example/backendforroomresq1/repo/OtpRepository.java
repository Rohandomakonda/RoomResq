package com.example.backendforroomresq1.repo;

import com.example.backendforroomresq1.Model.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    OtpEntity findTopByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<OtpEntity> findByUserEmail(String userEmail);

}
