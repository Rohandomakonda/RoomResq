package com.example.backendforroomresq1.RohanController;


import com.example.backendforroomresq1.dto.ProfileRequest;
import com.example.backendforroomresq1.service.ProfileService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {
    @Autowired
    ProfileService pr;

    @PostMapping("/update")
    public ResponseEntity<?> validateToken(@RequestBody ProfileRequest p) {
        // Remove "Bearer " prefix
       System.out.println("controller hit");
        return ResponseEntity.ok(pr.update(p));
    }

}

