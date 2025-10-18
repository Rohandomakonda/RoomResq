package com.example.backendforroomresq1.service;

import com.example.backendforroomresq1.Model.OtpEntity;
import com.example.backendforroomresq1.repo.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    public String generateAndStoreOtp(String userEmail) {
        // Delete all previous OTPs for this email
        List<OtpEntity> existingOtps = otpRepository.findByUserEmail(userEmail);
        if (existingOtps != null && !existingOtps.isEmpty()) {
            otpRepository.deleteAll(existingOtps);
        }

        // Generate new OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        System.out.println("Generated OTP: " + otp);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        OtpEntity otpEntity = new OtpEntity(userEmail, otp, expiresAt);
        otpRepository.save(otpEntity);

        return otp;
    }


    public boolean validateOtp(String userEmail, String inputOtp) {
        OtpEntity otpEntity = otpRepository.findTopByUserEmailOrderByCreatedAtDesc(userEmail);
        if (otpEntity == null || otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false; // expired or not found
        }
        return otpEntity.getOtp().equals(inputOtp);
    }
}

