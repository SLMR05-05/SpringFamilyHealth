package com.example.backend.controller;

import com.example.backend.entity.InviteCode;
import com.example.backend.service.InviteCodeService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/invite-codes")
@CrossOrigin
public class InviteCodeController {
    private final InviteCodeService service;
    public InviteCodeController(InviteCodeService service) { this.service = service; }

    @GetMapping
    public List<InviteCode> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public InviteCode getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<InviteCode> create(@RequestBody InviteCode entity) {
        InviteCode created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/invite-codes/" + created.getInviteId())).body(created);
    }

    @PutMapping("/{id}")
    public InviteCode update(@PathVariable Integer id, @RequestBody InviteCode entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
