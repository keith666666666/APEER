package edu.citu.apeer.controller;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.User;
import edu.citu.apeer.entity.UserStatus;
import edu.citu.apeer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AdminController {
    
    private final UserRepository userRepository;
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        List<UserDTO> userDTOs = users.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(capitalize(user.getRole().name()))
                        .status(capitalize(user.getStatus().name()))
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDTOs);
    }
    
    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserStatus(
            @PathVariable String id,
            @RequestBody UpdateUserStatusRequest request) {
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserStatus newStatus = request.getStatus().equalsIgnoreCase("active") 
                ? UserStatus.ACTIVE 
                : UserStatus.INACTIVE;
        
        user.setStatus(newStatus);
        user = userRepository.save(user);
        
        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(capitalize(user.getRole().name()))
                .status(capitalize(user.getStatus().name()))
                .build();
        
        return ResponseEntity.ok(userDTO);
    }
    
    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}

