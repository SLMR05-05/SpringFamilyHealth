package com.example.backend.controller;

import com.example.backend.entity.Doctor;
import com.example.backend.service.DoctorService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin
public class DoctorController {
    private final DoctorService service;
    public DoctorController(DoctorService service) { this.service = service; }

    @GetMapping
    public List<Doctor> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Doctor getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<Doctor> create(@RequestBody Doctor entity) {
        Doctor created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/doctors/" + created.getDoctorId())).body(created);
    }

    @PutMapping("/{id}")
    public Doctor update(@PathVariable Integer id, @RequestBody Doctor entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
