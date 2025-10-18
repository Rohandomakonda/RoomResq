package com.example.backendforroomresq1.service;

import com.example.backendforroomresq1.Model.User;
import com.example.backendforroomresq1.dto.ProfileRequest;
import com.example.backendforroomresq1.repo.AuthRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private AuthRepo authRepo;

    public ProfileRequest update(ProfileRequest pr) {
        // Find the user by email
        Optional<User> optionalUser = authRepo.findByEmail(pr.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Update fields from ProfileRequest
            if (pr.getName() != null && !pr.getName().isEmpty()) {
                user.setName(pr.getName());
            }

            if (pr.getRoomno() != null && !pr.getRoomno().isEmpty()) {
                user.setRoomno(pr.getRoomno());
            }

            // Save the updated user
            authRepo.save(user);

            // Optionally return updated info
            pr.setName(user.getName());
            pr.setRoomno(user.getRoomno());

            return pr;
        } else {
            // Handle user not found
            throw new RuntimeException("User with email " + pr.getEmail() + " not found");
        }
    }
}

