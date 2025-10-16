package com.example.backend.repository;

import com.example.backend.models.Vaccination;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Integer> {
    List<Vaccination> findByMember_Id(Integer memberId);
    List<Vaccination> findByVaccineNameContainingIgnoreCase(String vaccineName);
}
