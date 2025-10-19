package com.example.backendforroomresq1.repo;


import com.example.backendforroomresq1.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (useful for login)
    Optional<User> findByEmail(String email);

    // Find all staff members
    List<User> findByRoles(String roles);
}
