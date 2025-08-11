package com.mkyong.quiz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Hardcoded credentials
    private static final String USERNAME = "admin";
    private static final String PASSWORD = "password";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (USERNAME.equals(username) && PASSWORD.equals(password)) {
            return ResponseEntity.ok(Map.of("username", username));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password!"));
    }
}

