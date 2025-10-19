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

    // Submit Complaint
    @PostMapping("/submit")
    public Complaint submitComplaint(@RequestBody Complaint complaint) {
        complaint.setStatus("Submitted");
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    // Track Complaints for a Student
    @GetMapping("/track/{studentId}")
    public List<Complaint> trackComplaints(@PathVariable Long studentId) {
        return complaintRepository.findByStudentId(studentId);
    }


    // Update Complaint Status (for staff)
    @PutMapping("/update-status/{complaintId}")
    public Complaint updateStatus(
            @PathVariable Long complaintId
    ) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow();
        complaint.setStatus("Resolved");
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    // Assign Staff to Complaint
    @PutMapping("/assign-staff/{complaintId}")
    public Complaint assignStaff(
            @PathVariable Long complaintId,
            @RequestParam Long staffId
    ) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow();
        complaint.setStaffId(staffId);
        complaint.setStatus("In Progress");
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }
    @GetMapping("/all-unassigned")
    public List<Complaint> getAllUnassignedComplaints() {
        return complaintRepository.findByStaffIdIsNull();
    }
    @GetMapping("/getassigned/{staffId}")
    public List<Complaint> getAssignedComplaints(@PathVariable Long staffId) {
        return complaintRepository.findByStaffIdAndStatusIn(staffId, List.of("Resolved", "In Progress"));
    }
}