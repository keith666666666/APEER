package edu.citu.apeer.controller;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.User;
import edu.citu.apeer.entity.UserRole;
import edu.citu.apeer.entity.UserStatus;
import edu.citu.apeer.repository.UserRepository;
import edu.citu.apeer.security.JwtUtil;
import edu.citu.apeer.service.GoogleTokenVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final GoogleTokenVerificationService googleTokenService;
    
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody GoogleAuthRequest request) {
        try {
            String idToken = request.getToken();
            
            // Verify Google ID token
            GoogleTokenVerificationService.GoogleUserInfo googleUser = 
                    googleTokenService.verifyToken(idToken);
            
            if (googleUser == null || !googleUser.isVerified()) {
                log.warn("Invalid or unverified Google token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid Google token");
            }
            
            String email = googleUser.getEmail();
            String name = googleUser.getName();
            
            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        UserRole role = determineRole(email);
                        User newUser = User.builder()
                                .email(email)
                                .name(name)
                                .role(role)
                                .status(UserStatus.ACTIVE)
                                .build();
                        return userRepository.save(newUser);
                    });
            
            // Update user name if it changed
            if (!user.getName().equals(name)) {
                user.setName(name);
                user = userRepository.save(user);
            }
            
            // Generate JWT token
            String jwt = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            
            AuthResponse response = AuthResponse.builder()
                    .token(jwt)
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole().name().toLowerCase())
                    .build();
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Authentication error: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication failed: " + e.getMessage());
        }
    }
    
    private UserRole determineRole(String email) {
        if (email.contains("teacher") || email.contains("prof")) {
            return UserRole.TEACHER;
        } else if (email.contains("admin")) {
            return UserRole.ADMIN;
        }
        return UserRole.STUDENT;
    }
    
    private String extractNameFromEmail(String email) {
        return email.split("@")[0].replace(".", " ");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("User with email " + request.getEmail() + " already exists");
            }
            
            // Determine role
            UserRole role = determineRoleFromString(request.getRole());
            
            // Create new user
            User newUser = User.builder()
                    .email(request.getEmail())
                    .name(request.getName())
                    .role(role)
                    .status(UserStatus.ACTIVE)
                    .build();
            
            newUser = userRepository.save(newUser);
            
            // Generate JWT token
            String jwt = jwtUtil.generateToken(newUser.getEmail(), newUser.getRole().name());
            
            AuthResponse response = AuthResponse.builder()
                    .token(jwt)
                    .email(newUser.getEmail())
                    .name(newUser.getName())
                    .role(newUser.getRole().name().toLowerCase())
                    .build();
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Registration error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }
    
    private UserRole determineRoleFromString(String roleString) {
        if (roleString == null) {
            return UserRole.STUDENT;
        }
        String roleLower = roleString.toLowerCase();
        if (roleLower.contains("teacher") || roleLower.contains("prof")) {
            return UserRole.TEACHER;
        } else if (roleLower.contains("admin")) {
            return UserRole.ADMIN;
        }
        return UserRole.STUDENT;
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("APEER Backend is running");
    }
}

