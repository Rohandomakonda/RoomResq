package com.example.backendforroomresq1.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String title;
    private String description;
    private String status; // Pending, In Progress, Resolved, Closed

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String timeSlot; // Extra feature: time-slot selection

    @ManyToOne
    @JoinColumn(name="student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name="staff_id")
    private User assignedStaff;

    // Getters and Setters
}
