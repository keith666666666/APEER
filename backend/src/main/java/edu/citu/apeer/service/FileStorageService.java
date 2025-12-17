package edu.citu.apeer.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${server.port:8080}")
    private String serverPort;
    
    public String storeFile(MultipartFile file, String userId) {
        try {
            // Create upload directory if it doesn't exist: uploads/avatars
            Path uploadPath = Paths.get(uploadDir, "avatars");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", uploadPath);
            }
            
            // Validate file type
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                throw new RuntimeException("File name is null");
            }
            
            String extension = "";
            int lastDotIndex = originalFilename.lastIndexOf('.');
            if (lastDotIndex > 0) {
                extension = originalFilename.substring(lastDotIndex).toLowerCase();
            }
            
            // Validate image extensions
            if (!extension.matches("\\.(jpg|jpeg|png|gif|webp)$")) {
                throw new RuntimeException("Invalid file type. Only images (jpg, jpeg, png, gif, webp) are allowed.");
            }
            
            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("File size exceeds 5MB limit.");
            }
            
            // Generate unique filename
            String filename = userId + "_" + UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);
            
            // Copy file to upload directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Stored avatar file: {} for user: {}", filename, userId);
            
            // Return URL path
            return "/api/files/avatars/" + filename;
            
        } catch (IOException e) {
            log.error("Error storing file: ", e);
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }
    
    public void deleteFile(String filename) {
        try {
            // Extract just the filename from the URL path if it includes /api/files/avatars/
            if (filename.contains("/")) {
                filename = filename.substring(filename.lastIndexOf('/') + 1);
            }
            
            Path filePath = Paths.get(uploadDir, "avatars").resolve(filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Deleted avatar file: {}", filename);
            }
        } catch (IOException e) {
            log.error("Error deleting file: {}", filename, e);
        }
    }
}

