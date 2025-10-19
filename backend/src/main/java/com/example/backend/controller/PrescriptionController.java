package com.example.backend.controller;

import com.example.backend.entity.Prescription;
import com.example.backend.service.PrescriptionService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin
public class PrescriptionController {
    private final PrescriptionService service;
    public PrescriptionController(PrescriptionService service) { this.service = service; }

    @GetMapping
    public List<Prescription> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Prescription getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<Prescription> create(@RequestBody Prescription entity) {
        Prescription created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/prescriptions/" + created.getPrescriptionId())).body(created);
    }

    @PutMapping("/{id}")
    public Prescription update(@PathVariable Integer id, @RequestBody Prescription entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
