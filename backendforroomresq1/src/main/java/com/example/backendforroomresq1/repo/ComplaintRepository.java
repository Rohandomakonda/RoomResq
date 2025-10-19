package com.example.backendforroomresq1.repo;

import com.example.backendforroomresq1.Model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStudentId(Long studentId);
    List<Complaint> findByStaffIdIsNull();
    List<Complaint> findByStaffIdAndStatusIn(Long staffId, List<String> statusList);

    List<Complaint> findByStudentIdAndStatusIn(Long studentId, List<String> statuses);
}
