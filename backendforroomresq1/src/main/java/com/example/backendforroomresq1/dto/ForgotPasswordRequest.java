package com.example.backendforroomresq1.dto;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
    public String getEmail(){
        return email;
    }
}

