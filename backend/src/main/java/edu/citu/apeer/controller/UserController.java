package edu.citu.apeer.controller;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.User;
import edu.citu.apeer.repository.UserRepository;
import edu.citu.apeer.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class UserController {
    
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileDTO> getProfile(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ProfileDTO profile = ProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name().toLowerCase())
                .department(null) // Can be added to User entity if needed
                .avatarUrl(user.getAvatarUrl())
                .joinedDate(user.getCreatedAt())
                .build();
        
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping(value = "/profile", consumes = {"multipart/form-data"})
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileDTO> updateProfile(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "avatar", required = false) MultipartFile avatarFile,
            Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (name != null && !name.trim().isEmpty()) {
            user.setName(name.trim());
        }
        
        // Handle avatar upload
        if (avatarFile != null && !avatarFile.isEmpty()) {
            try {
                // Delete old avatar if exists
                if (user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty()) {
                    fileStorageService.deleteFile(user.getAvatarUrl());
                }
                
                // Store new avatar
                String avatarUrl = fileStorageService.storeFile(avatarFile, user.getId());
                user.setAvatarUrl(avatarUrl);
                log.info("Avatar uploaded successfully for user {}: {}", email, avatarUrl);
            } catch (Exception e) {
                log.error("Error uploading avatar for user {}: ", email, e);
                throw new RuntimeException("Failed to upload avatar: " + e.getMessage());
            }
        }
        
        user = userRepository.save(user);
        
        ProfileDTO profile = ProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name().toLowerCase())
                .department(null)
                .avatarUrl(user.getAvatarUrl())
                .joinedDate(user.getCreatedAt())
                .build();
        
        return ResponseEntity.ok(profile);
    }
}

