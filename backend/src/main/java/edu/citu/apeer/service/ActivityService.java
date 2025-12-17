package edu.citu.apeer.service;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.*;
import edu.citu.apeer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ActivityService {
    
    private final EvaluationActivityRepository activityRepository;
    private final RubricRepository rubricRepository;
    private final EvaluationSubmissionRepository submissionRepository;
    
    public List<ActivityDTO> getAllActivities() {
        return activityRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ActivityDTO> getActiveActivities() {
        return activityRepository.findActiveActivities()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ActivityDTO createActivity(CreateActivityRequest request) {
        Rubric rubric = rubricRepository.findById(request.getRubricId())
                .orElseThrow(() -> new RuntimeException("Rubric not found"));
        
        // Parse date - handle both ISO_DATE (YYYY-MM-DD) and ISO_DATE_TIME (YYYY-MM-DDTHH:mm:ss) formats
        LocalDateTime dueDate;
        try {
            // Try parsing as ISO_DATE_TIME first (full datetime)
            dueDate = LocalDateTime.parse(request.getDueDate(), 
                    DateTimeFormatter.ISO_DATE_TIME);
        } catch (DateTimeParseException e) {
            try {
                // If that fails, try parsing as ISO_DATE (date only) and set time to end of day
                LocalDate date = LocalDate.parse(request.getDueDate(), 
                        DateTimeFormatter.ISO_DATE);
                dueDate = date.atTime(23, 59, 59); // Set to end of day
            } catch (DateTimeParseException e2) {
                throw new RuntimeException("Invalid date format. Expected ISO_DATE (YYYY-MM-DD) or ISO_DATE_TIME (YYYY-MM-DDTHH:mm:ss)", e2);
            }
        }
        
        EvaluationActivity activity = EvaluationActivity.builder()
                .name(request.getName())
                .rubric(rubric)
                .dueDate(dueDate)
                .status(ActivityStatus.ACTIVE)
                .participants(request.getParticipantIds() != null ? 
                             request.getParticipantIds().size() : 0)
                .build();
        
        activity = activityRepository.save(activity);
        
        return convertToDTO(activity);
    }
    
    private ActivityDTO convertToDTO(EvaluationActivity activity) {
        // Calculate submission count for this activity
        int submissionCount = submissionRepository.findByActivityId(activity.getId()).size();
        
        return ActivityDTO.builder()
                .id(activity.getId())
                .name(activity.getName())
                .rubricId(activity.getRubric().getId())
                .dueDate(activity.getDueDate().toString())
                .status(activity.getStatus().name().toLowerCase())
                .participants(activity.getParticipants())
                .submissionCount(submissionCount)
                .totalParticipants(activity.getParticipants())
                .build();
    }
}

