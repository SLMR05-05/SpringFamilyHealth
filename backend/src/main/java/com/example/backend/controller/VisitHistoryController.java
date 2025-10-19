package com.example.backend.controller;

import com.example.backend.entity.VisitHistory;
import com.example.backend.service.VisitHistoryService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/visit-histories")
@CrossOrigin
public class VisitHistoryController {
    private final VisitHistoryService service;
    public VisitHistoryController(VisitHistoryService service) { this.service = service; }

    @GetMapping
    public List<VisitHistory> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public VisitHistory getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<VisitHistory> create(@RequestBody VisitHistory entity) {
        VisitHistory created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/visit-histories/" + created.getVisitId())).body(created);
    }

    @PutMapping("/{id}")
    public VisitHistory update(@PathVariable Integer id, @RequestBody VisitHistory entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
