package com.example.backend.controller;

import com.example.backend.entity.Medication;
import com.example.backend.service.MedicationService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin
public class MedicationController {
    private final MedicationService service;
    public MedicationController(MedicationService service) { this.service = service; }

    @GetMapping
    public List<Medication> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Medication getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<Medication> create(@RequestBody Medication entity) {
        Medication created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/medications/" + created.getMedicationId())).body(created);
    }

    @PutMapping("/{id}")
    public Medication update(@PathVariable Integer id, @RequestBody Medication entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
