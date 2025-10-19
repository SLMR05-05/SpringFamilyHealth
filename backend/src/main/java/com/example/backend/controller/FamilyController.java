package com.example.backend.controller;

import com.example.backend.entity.Family;
import com.example.backend.service.FamilyService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/families")
@CrossOrigin
public class FamilyController {
    private final FamilyService service;
    public FamilyController(FamilyService service) { this.service = service; }

    @GetMapping
    public List<Family> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Family getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<Family> create(@RequestBody Family entity) {
        Family created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/families/" + created.getFamilyId())).body(created);
    }

    @PutMapping("/{id}")
    public Family update(@PathVariable Integer id, @RequestBody Family entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
