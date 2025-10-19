package com.example.backend.controller;

import com.example.backend.entity.Admin;
import com.example.backend.service.AdminService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin
public class AdminController {
    private final AdminService service;
    public AdminController(AdminService service) { this.service = service; }

    @GetMapping
    public List<Admin> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Admin getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<Admin> create(@RequestBody Admin entity) {
        Admin created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/admins/" + created.getAdminId())).body(created);
    }

    @PutMapping("/{id}")
    public Admin update(@PathVariable Integer id, @RequestBody Admin entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
