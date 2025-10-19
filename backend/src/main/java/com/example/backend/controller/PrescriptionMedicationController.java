package com.example.backend.controller;

import com.example.backend.entity.PrescriptionMedication;
import com.example.backend.entity.PrescriptionMedicationId;
import com.example.backend.service.PrescriptionMedicationService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/prescription-medications")
@CrossOrigin
public class PrescriptionMedicationController {
    private final PrescriptionMedicationService service;
    public PrescriptionMedicationController(PrescriptionMedicationService service) { this.service = service; }

    @GetMapping
    public List<PrescriptionMedication> getAll() { return service.findAll(); }

    @GetMapping("/{prescriptionId}/{medicationId}")
    public PrescriptionMedication getById(@PathVariable Integer prescriptionId, @PathVariable Integer medicationId) {
        return service.findById(new PrescriptionMedicationId(prescriptionId, medicationId));
    }

    @PostMapping
    public ResponseEntity<PrescriptionMedication> create(@RequestBody PrescriptionMedication entity) {
        PrescriptionMedication created = service.create(entity);
        PrescriptionMedicationId id = created.getId();
        return ResponseEntity.created(URI.create(String.format("/api/prescription-medications/%d/%d", id.getPrescriptionId(), id.getMedicationId()))).body(created);
    }

    @PutMapping("/{prescriptionId}/{medicationId}")
    public PrescriptionMedication update(@PathVariable Integer prescriptionId, @PathVariable Integer medicationId, @RequestBody PrescriptionMedication entity) {
        return service.update(new PrescriptionMedicationId(prescriptionId, medicationId), entity);
    }

    @DeleteMapping("/{prescriptionId}/{medicationId}")
    public ResponseEntity<Void> delete(@PathVariable Integer prescriptionId, @PathVariable Integer medicationId) {
        service.delete(new PrescriptionMedicationId(prescriptionId, medicationId));
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
