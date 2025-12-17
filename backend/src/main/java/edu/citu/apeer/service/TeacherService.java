package edu.citu.apeer.service;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.AnalysisResult;
import edu.citu.apeer.entity.User;
import edu.citu.apeer.entity.UserRole;
import edu.citu.apeer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherService {
    
    private final UserRepository userRepository;
    private final EvaluationSubmissionRepository submissionRepository;
    private final AnalysisResultRepository analysisRepository;
    
    public ClassAnalyticsDTO getClassAnalytics() {
        List<User> students = userRepository.findByRole(UserRole.STUDENT);
        long totalStudents = students.size();
        
        Double classAvg = students.stream()
                .map(s -> submissionRepository.calculateAverageScore(s.getId()))
                .filter(score -> score != null)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
        
        List<AnalysisResult> flagged = analysisRepository.findAllFlagged();
        List<FlaggedStudentDTO> flaggedStudents = flagged.stream()
                .map(a -> {
                    User student = a.getSubmission().getEvaluator();
                    return FlaggedStudentDTO.builder()
                            .id(student.getId())
                            .name(student.getName())
                            .reason(a.getFlagReason())
                            .severity("HIGH")
                            .build();
                })
                .distinct()
                .collect(Collectors.toList());
        
        return ClassAnalyticsDTO.builder()
                .name("CS401 - Software Engineering")
                .totalStudents((int) totalStudents)
                .averageScore(classAvg)
                .classAverage(classAvg)
                .submissionRate(85)
                .biasFlags(flaggedStudents.size())
                .flaggedStudents(flaggedStudents)
                .build();
    }
    
    public List<StudentSummaryDTO> getStudentList() {
        List<User> students = userRepository.findByRole(UserRole.STUDENT);
        
        return students.stream()
                .map(student -> {
                    long given = submissionRepository.countByEvaluatorId(student.getId());
                    long received = submissionRepository.countByTargetId(student.getId());
                    Double avgScore = submissionRepository.calculateAverageScore(student.getId());
                    Double avgUsefulness = analysisRepository.calculateAverageUsefulnessGiven(student.getId());
                    
                    boolean isBiased = submissionRepository.findByEvaluatorId(student.getId())
                            .stream()
                            .anyMatch(s -> s.getAnalysisResult() != null && 
                                          s.getAnalysisResult().getIsFlagged());
                    
                    return StudentSummaryDTO.builder()
                            .id(student.getId())
                            .name(student.getName())
                            .email(student.getEmail())
                            .overallScore(avgScore != null ? avgScore.intValue() : 0)
                            .evaluationsGiven((int) given)
                            .evaluationsReceived((int) received)
                            .feedbackQuality(avgUsefulness != null ? avgUsefulness.intValue() : 0)
                            .participationRate(Math.min(100, (int) (given * 10)))
                            .isBiased(isBiased)
                            .biasScore(isBiased ? 2.5 : 0.0)
                            .pendingReviews(0)
                            .build();
                })
                .collect(Collectors.toList());
    }
}

