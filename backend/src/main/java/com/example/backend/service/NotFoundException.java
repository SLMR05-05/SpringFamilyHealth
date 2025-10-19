package com.example.backend.service;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) { super(message); }
}
