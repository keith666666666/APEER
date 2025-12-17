package edu.citu.apeer.controller;

import edu.citu.apeer.entity.*;
import edu.citu.apeer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ActivityController {
    
    private final EvaluationActivityRepository activityRepository;
    private final EvaluationSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final CriterionScoreRepository scoreRepository;
    private final AnalysisResultRepository analysisRepository;
    
    @GetMapping("/{id}/export")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<byte[]> exportActivityCSV(@PathVariable("id") String id) {
        EvaluationActivity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        
        List<EvaluationSubmission> submissions = submissionRepository.findByActivityId(id);
        
        // Get all unique students who received evaluations
        List<String> studentIds = submissions.stream()
                .map(s -> s.getTarget().getId())
                .distinct()
                .collect(Collectors.toList());
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8)) {
            // Write BOM for Excel compatibility
            baos.write(0xEF);
            baos.write(0xBB);
            baos.write(0xBF);
            
            // Write header
            writer.write("Student Name,Email,Group,Evaluations Received,Average Score,AI Flagged?\n");
            
            // Write data rows
            for (String studentId : studentIds) {
                User student = userRepository.findById(studentId).orElse(null);
                if (student == null) continue;
                
                // Find group membership (using new @ManyToOne relationship)
                String groupName = "Ungrouped";
                if (student.getGroup() != null) {
                    groupName = student.getGroup().getName();
                }
                
                // Count evaluations received
                long evalCount = submissions.stream()
                        .filter(s -> s.getTarget().getId().equals(studentId))
                        .count();
                
                // Calculate average score
                List<EvaluationSubmission> studentSubmissions = submissions.stream()
                        .filter(s -> s.getTarget().getId().equals(studentId))
                        .collect(Collectors.toList());
                
                double avgScore = 0.0;
                if (!studentSubmissions.isEmpty()) {
                    int totalScore = 0;
                    int maxScore = 0;
                    for (EvaluationSubmission sub : studentSubmissions) {
                        List<CriterionScore> scores = scoreRepository.findBySubmissionId(sub.getId());
                        for (CriterionScore score : scores) {
                            totalScore += score.getScore();
                            maxScore += score.getMaxScore();
                        }
                    }
                    if (maxScore > 0) {
                        avgScore = (double) totalScore / maxScore * 100;
                    }
                }
                
                // Check if AI flagged
                boolean isFlagged = studentSubmissions.stream()
                        .anyMatch(s -> {
                            AnalysisResult analysis = s.getAnalysisResult();
                            return analysis != null && analysis.getIsFlagged();
                        });
                
                writer.write(String.format("%s,%s,%s,%d,%.2f,%s\n",
                        escapeCSV(student.getName()),
                        escapeCSV(student.getEmail()),
                        escapeCSV(groupName),
                        evalCount,
                        avgScore,
                        isFlagged ? "Yes" : "No"));
            }
            
            writer.flush();
        } catch (IOException e) {
            throw new RuntimeException("Error generating CSV", e);
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=utf-8"));
        headers.setContentDispositionFormData("attachment", 
                "activity_" + activity.getName().replaceAll("[^a-zA-Z0-9]", "_") + ".csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(baos.toByteArray());
    }
    
    private String escapeCSV(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}

