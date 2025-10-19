package com.example.backend.controller;

import com.example.backend.entity.HealthRecord;
import com.example.backend.service.HealthRecordService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/health-records")
@CrossOrigin
public class HealthRecordController {
    private final HealthRecordService service;
    public HealthRecordController(HealthRecordService service) { this.service = service; }

    @GetMapping
    public List<HealthRecord> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public HealthRecord getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<HealthRecord> create(@RequestBody HealthRecord entity) {
        HealthRecord created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/health-records/" + created.getRecordId())).body(created);
    }

    @PutMapping("/{id}")
    public HealthRecord update(@PathVariable Integer id, @RequestBody HealthRecord entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
