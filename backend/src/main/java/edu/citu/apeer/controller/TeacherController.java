package edu.citu.apeer.controller;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.*;
import edu.citu.apeer.repository.*;
import edu.citu.apeer.service.TeacherService;
import edu.citu.apeer.service.ActivityService;
import edu.citu.apeer.service.RubricService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class TeacherController {
    
    private final TeacherService teacherService;
    private final ActivityService activityService;
    private final RubricService rubricService;
    private final EvaluationActivityRepository activityRepository;
    private final EvaluationSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final StudentGroupRepository groupRepository;
    private final CriterionScoreRepository scoreRepository;
    private final AnalysisResultRepository analysisRepository;
    
    @GetMapping("/class-overview")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ClassAnalyticsDTO> getClassOverview() {
        ClassAnalyticsDTO analytics = teacherService.getClassAnalytics();
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<StudentSummaryDTO>> getStudents() {
        List<StudentSummaryDTO> students = teacherService.getStudentList();
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/students/ungrouped")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<UserDTO>> getUngroupedStudents() {
        List<User> ungrouped = userRepository.findUngroupedStudents();
        List<UserDTO> dtos = ungrouped.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .status(user.getStatus().name())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/activities")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<ActivityDTO>> getActivities() {
        List<ActivityDTO> activities = activityService.getAllActivities();
        return ResponseEntity.ok(activities);
    }
    
    @PostMapping("/activities")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ActivityDTO> createActivity(
            @RequestBody CreateActivityRequest request) {
        ActivityDTO activity = activityService.createActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(activity);
    }
    
    @GetMapping("/rubrics")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<RubricDTO>> getRubrics() {
        List<RubricDTO> rubrics = rubricService.getAllRubrics();
        return ResponseEntity.ok(rubrics);
    }
    
    @GetMapping(value = {"/activities/{id}/export", "/activities/{id}/export"}, produces = "text/csv")
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

