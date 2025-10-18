package com.example.backendforroomresq1.dto;

import lombok.Data;

@Data
//@AllArgsConstructor
public class Users {
    private String name;



    public Users(String n) {
        name=n;
    }
}
