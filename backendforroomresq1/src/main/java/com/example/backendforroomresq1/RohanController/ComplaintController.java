package com.example.backendforroomresq1.RohanController;

import com.example.backendforroomresq1.Model.Complaint;
import com.example.backendforroomresq1.Model.User;
import com.example.backendforroomresq1.repo.ComplaintRepository;
import com.example.backendforroomresq1.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private UserRepository userRepo;

    // Submit Complaint
    @PostMapping("/submit")
    public Complaint submitComplaint(@RequestBody Complaint complaint) {
        complaint.setStatus("Pending");
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    // Track Complaints
    @GetMapping("/track/{studentId}")
    public List<Complaint> trackComplaints(@PathVariable Long studentId) {
        return complaintRepository.findByStudentId(studentId);
    }

    // Update Complaint Status (for staff)
    @PutMapping("/update-status/{complaintId}")
    public Complaint updateStatus(@PathVariable Long complaintId, @RequestParam String status) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow();
        complaint.setStatus(status);
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    // Assign Staff
    @PutMapping("/assign-staff/{complaintId}")
    public Complaint assignStaff(@PathVariable Long complaintId, @RequestParam Long staffId) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow();
        User staff = userRepo.findById(staffId).orElseThrow();
        complaint.setAssignedStaff(staff);
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }
}
