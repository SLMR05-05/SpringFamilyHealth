package com.example.backend.controller;

import com.example.backend.entity.Member;
import com.example.backend.service.MemberService;
import com.example.backend.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin
public class MemberController {
    private final MemberService service;
    public MemberController(MemberService service) { this.service = service; }

    @GetMapping
    public List<Member> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Member getById(@PathVariable Integer id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<Member> create(@RequestBody Member entity) {
        Member created = service.create(entity);
        return ResponseEntity.created(URI.create("/api/members/" + created.getMemberId())).body(created);
    }

    @PutMapping("/{id}")
    public Member update(@PathVariable Integer id, @RequestBody Member entity) { return service.update(id, entity); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); }
}
