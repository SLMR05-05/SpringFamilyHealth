package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User findById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id=" + id));
    }

    @Transactional
    public User create(User user) {
        // ensure id is null to trigger auto-increment
        user.setUserId(null);
        // Optional pre-check for email uniqueness to provide clearer error
        if (user.getEmail() != null && userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already exists: " + user.getEmail());
        }
        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateResourceException("Unique constraint violation. Possibly duplicate email.", ex);
        }
    }

    @Transactional
    public User update(Integer id, User payload) {
        User existing = findById(id);

        // If email changes, check uniqueness
        if (payload.getEmail() != null && !payload.getEmail().equals(existing.getEmail())) {
            userRepository.findByEmail(payload.getEmail()).ifPresent(other -> {
                if (!other.getUserId().equals(id)) {
                    throw new DuplicateResourceException("Email already exists: " + payload.getEmail());
                }
            });
        }

        existing.setRole(payload.getRole());
        existing.setPasswordHash(payload.getPasswordHash());
        existing.setName(payload.getName());
        existing.setPhone(payload.getPhone());
        existing.setEmail(payload.getEmail());
        try {
            return userRepository.save(existing);
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateResourceException("Unique constraint violation. Possibly duplicate email.", ex);
        }
    }

    @Transactional
    public void delete(Integer id) {
        User existing = findById(id);
        userRepository.delete(existing);
    }

    // Simple custom exceptions for service layer
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) { super(message); }
    }

    public static class DuplicateResourceException extends RuntimeException {
        public DuplicateResourceException(String message) { super(message); }
        public DuplicateResourceException(String message, Throwable cause) { super(message, cause); }
    }
}
