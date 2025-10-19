package com.example.backend.controller;

import com.example.backend.entity.Vaccination;
import com.example.backend.service.VaccinationService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
@CrossOrigin
public class VaccinationController {
    private final VaccinationService service;
    public VaccinationController(VaccinationService service) { this.service = service; }

    @GetMapping
    public List<Vaccination> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Vaccination getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<Vaccination> create(@RequestBody Vaccination entity) {
        Vaccination created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/vaccinations/" + created.getVaccineId())).body(created);
    }

    @PutMapping("/{id}")
    public Vaccination update(@PathVariable Integer id, @RequestBody Vaccination entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
