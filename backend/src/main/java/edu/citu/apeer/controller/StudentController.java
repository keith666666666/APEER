package edu.citu.apeer.controller;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.User;
import edu.citu.apeer.service.StudentService;
import edu.citu.apeer.service.EvaluationService;
import edu.citu.apeer.service.ActivityService;
import edu.citu.apeer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class StudentController {
    
    private final StudentService studentService;
    private final EvaluationService evaluationService;
    private final ActivityService activityService;
    private final UserRepository userRepository;
    
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<StudentDashboardDTO> getDashboard(Authentication auth) {
        String email = auth.getName();
        StudentDashboardDTO dashboard = studentService.getDashboardData(email);
        return ResponseEntity.ok(dashboard);
    }
    
    @PostMapping("/evaluations/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EvaluationSubmissionResponse> submitEvaluation(
            @RequestBody EvaluationSubmissionRequest request,
            Authentication auth) {
        String email = auth.getName();
        EvaluationSubmissionResponse response = 
                evaluationService.submitEvaluation(email, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/feedback-history")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<List<FeedbackHistoryDTO>> getFeedbackHistory(Authentication auth) {
        String email = auth.getName();
        List<FeedbackHistoryDTO> history = studentService.getFeedbackHistory(email);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/students-to-evaluate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<UserDTO>> getStudentsToEvaluate(Authentication auth) {
        String email = auth.getName();
        List<User> students = evaluationService.getStudentsToEvaluate(email);
        
        List<UserDTO> studentDTOs = students.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .status(user.getStatus().name())
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(studentDTOs);
    }
    
    @GetMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<byte[]> exportPersonalReport(Authentication auth) {
        String email = auth.getName();
        byte[] report = studentService.generatePersonalReport(email);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/pdf"));
        headers.setContentDispositionFormData("attachment", "personal_report.pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(report);
    }
    
    @GetMapping("/activities")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<List<ActivityDTO>> getActivities(Authentication auth) {
        // Students can see all active activities
        List<ActivityDTO> activities = activityService.getActiveActivities();
        return ResponseEntity.ok(activities);
    }
}
