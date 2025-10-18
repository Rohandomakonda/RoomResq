package com.example.backendforroomresq1.dto;

import com.example.backendforroomresq1.Model.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Set;

@Data
public class AuthResponse {
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("refresh_token")
    private String refreshToken;
    @JsonProperty("id")
    private Long id;
    @JsonProperty("email")
    private String email;
    @JsonProperty("name")
    private String name;
    @JsonProperty("roles")
    private Set<Role> roles;
    @JsonProperty("roomno")
    private String roomno;


    private String googleAccessToken;

    public AuthResponse(String accessToken, String refreshToken, Long id, String email, String name, Set<Role> roles, String roomno) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.roomno=roomno;


    }


}