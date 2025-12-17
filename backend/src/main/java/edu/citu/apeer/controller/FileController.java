package edu.citu.apeer.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class FileController {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String filename) {
        try {
            // Resolve file path: uploadDir/avatars/filename
            Path filePath = Paths.get(uploadDir, "avatars").resolve(filename).normalize();
            
            // Security check: ensure the path is within the upload directory
            Path uploadBase = Paths.get(uploadDir, "avatars").normalize();
            if (!filePath.startsWith(uploadBase)) {
                log.warn("Attempted to access file outside upload directory: {}", filename);
                return ResponseEntity.status(403).build();
            }
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = "image/jpeg";
                String lowerFilename = filename.toLowerCase();
                if (lowerFilename.endsWith(".png")) {
                    contentType = "image/png";
                } else if (lowerFilename.endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (lowerFilename.endsWith(".webp")) {
                    contentType = "image/webp";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                log.warn("File not found or not readable: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error loading file: {}", filename, e);
            return ResponseEntity.notFound().build();
        }
    }
}

