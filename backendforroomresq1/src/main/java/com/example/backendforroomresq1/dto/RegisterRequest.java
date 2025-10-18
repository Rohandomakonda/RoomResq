package com.example.backendforroomresq1.dto;



import com.example.backendforroomresq1.Model.Role;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Set<Role> roles;
    private String roomno;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getRoomno() {
        return roomno;
    }

    public void setRoomno(String name) {
        this.roomno = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

}