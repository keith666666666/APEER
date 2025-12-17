package edu.citu.apeer.service;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.*;
import edu.citu.apeer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EvaluationService {
    
    private final UserRepository userRepository;
    private final EvaluationActivityRepository activityRepository;
    private final EvaluationSubmissionRepository submissionRepository;
    private final CriterionScoreRepository scoreRepository;
    private final AnalysisResultRepository analysisRepository;
    private final FakeAIService aiService;
    
    /**
     * Get list of students that the current student can evaluate
     * Based on group membership - students can only evaluate peers in their group
     */
    public List<User> getStudentsToEvaluate(String currentStudentEmail) {
        User currentUser = userRepository.findByEmail(currentStudentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // If user has no group, return empty list (or all students if class-wide activity)
        if (currentUser.getGroup() == null) {
            // Return all students except self (for class-wide activities)
            return userRepository.findByRole(UserRole.STUDENT).stream()
                    .filter(u -> !u.getId().equals(currentUser.getId()))
                    .filter(u -> u.getStatus() == UserStatus.ACTIVE)
                    .collect(java.util.stream.Collectors.toList());
        }
        
        // Get all students in the same group, excluding self
        String groupId = currentUser.getGroup().getId();
        return userRepository.findByGroupId(groupId).stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .filter(u -> u.getStatus() == UserStatus.ACTIVE)
                .collect(java.util.stream.Collectors.toList());
    }
    
    public EvaluationSubmissionResponse submitEvaluation(
            String evaluatorEmail,
            EvaluationSubmissionRequest request) {
        
        User evaluator = userRepository.findByEmail(evaluatorEmail)
                .orElseThrow(() -> new RuntimeException("Evaluator not found"));
        
        if (request.getTargetStudentId() == null || request.getTargetStudentId().isEmpty()) {
            throw new RuntimeException("Target student ID is required");
        }
        
        User target = userRepository.findById(request.getTargetStudentId())
                .orElseThrow(() -> new RuntimeException("Target student not found with ID: " + request.getTargetStudentId()));
        
        if (request.getActivityId() == null || request.getActivityId().isEmpty()) {
            throw new RuntimeException("Activity ID is required");
        }
        
        EvaluationActivity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found with ID: " + request.getActivityId()));
        
        if (submissionRepository.existsByEvaluatorIdAndTargetIdAndActivityId(
                evaluator.getId(), target.getId(), activity.getId())) {
            throw new RuntimeException("You have already evaluated this student for this activity");
        }
        
        EvaluationSubmission submission = EvaluationSubmission.builder()
                .evaluator(evaluator)
                .target(target)
                .activity(activity)
                .comment(request.getComment())
                .build();
        
        submission = submissionRepository.save(submission);
        
        for (CriterionScoreRequest scoreReq : request.getScores()) {
            CriterionScore score = CriterionScore.builder()
                    .submission(submission)
                    .criterionName(scoreReq.getCriterionName())
                    .score(scoreReq.getScore())
                    .maxScore(5)
                    .build();
            scoreRepository.save(score);
        }
        
        AnalysisResultDTO analysisDTO = aiService.analyzeComment(request.getComment());
        
        AnalysisResult analysisResult = AnalysisResult.builder()
                .submission(submission)
                .tags(analysisDTO.getTags())
                .sentimentScore(analysisDTO.getSentimentScore())
                .usefulnessScore(analysisDTO.getUsefulnessScore())
                .isFlagged(analysisDTO.getIsFlagged())
                .flagReason(analysisDTO.getFlagReason())
                .build();
        
        analysisRepository.save(analysisResult);
        
        return EvaluationSubmissionResponse.builder()
                .id(submission.getId())
                .message("Evaluation submitted successfully")
                .analysis(analysisDTO)
                .build();
    }
}

