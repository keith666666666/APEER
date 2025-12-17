package edu.citu.apeer.service;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.*;
import edu.citu.apeer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {
    
    private final UserRepository userRepository;
    private final EvaluationSubmissionRepository submissionRepository;
    private final AnalysisResultRepository analysisRepository;
    private final CriterionScoreRepository scoreRepository;
    private final FakeAIService aiService;
    private final EvaluationActivityRepository activityRepository;
    
    public StudentDashboardDTO getDashboardData(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        long givenCount = submissionRepository.countByEvaluatorId(student.getId());
        long receivedCount = submissionRepository.countByTargetId(student.getId());
        Double avgUsefulness = analysisRepository.calculateAverageUsefulnessGiven(student.getId());
        
        List<SentimentTrendDTO> sentimentTrend = calculateSentimentTrend(student.getId());
        
        List<EvaluationSubmission> received = submissionRepository.findByTargetId(student.getId());
        List<String> comments = received.stream()
                .map(EvaluationSubmission::getComment)
                .filter(c -> c != null && !c.isEmpty())
                .collect(Collectors.toList());
        String aiSummary = aiService.generateSummary(comments);
        
        // Calculate real overall score: Average of all CriterionScore values received
        int overallScore = calculateRealOverallScore(student.getId());
        
        // Calculate participation rate: (submitted / assigned) * 100
        int participationRate = calculateParticipationRate(student.getId(), givenCount);
        
        // Calculate real sentiment trend from last 5 AnalysisResult entries
        List<SentimentTrendDTO> realSentimentTrend = calculateRealSentimentTrendFromAnalysis(student.getId());
        
        // Generate AI insights based on tags
        FeedbackSummaryDTO aiInsights = generateAIPersonalizedInsights(student.getId());
        
        // Get recent activity (last 3 evaluations received)
        List<RecentActivityDTO> recentActivity = getRecentActivity(student.getId());
        
        return StudentDashboardDTO.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .overallScore(overallScore)
                .evaluationsGiven((int) givenCount)
                .evaluationsReceived((int) receivedCount)
                .feedbackQuality(avgUsefulness != null ? avgUsefulness.intValue() : 0)
                .participationRate(participationRate)
                .sentimentTrend(realSentimentTrend.isEmpty() ? sentimentTrend : realSentimentTrend)
                .pendingReviews(0)
                .aiSummary(aiSummary)
                .feedbackSummary(aiInsights) // Use AI-generated insights
                .recentActivity(recentActivity)
                .build();
    }
    
    private int calculateRealOverallScore(String studentId) {
        List<EvaluationSubmission> received = submissionRepository.findByTargetId(studentId);
        if (received.isEmpty()) {
            return 0;
        }
        
        int totalScore = 0;
        int maxPossibleScore = 0;
        
        for (EvaluationSubmission submission : received) {
            List<CriterionScore> scores = scoreRepository.findBySubmissionId(submission.getId());
            for (CriterionScore score : scores) {
                totalScore += score.getScore();
                maxPossibleScore += score.getMaxScore();
            }
        }
        
        if (maxPossibleScore == 0) {
            return 0;
        }
        
        return (int) ((double) totalScore / maxPossibleScore * 100);
    }
    
    private List<SentimentTrendDTO> calculateSentimentTrend(String studentId) {
        List<SentimentTrendDTO> trend = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            trend.add(SentimentTrendDTO.builder()
                    .week("W" + i)
                    .score(70 + (i * 5))
                    .build());
        }
        return trend;
    }
    
    /**
     * Calculate sentiment trend from last 5 AnalysisResult entries
     * Query AnalysisResult directly for better performance
     */
    private List<SentimentTrendDTO> calculateRealSentimentTrendFromAnalysis(String studentId) {
        // Get last 5 AnalysisResult entries for this student (as target)
        List<AnalysisResult> recentAnalyses = analysisRepository.findTop5BySubmissionTargetIdOrderByCreatedAtDesc(studentId);
        
        // Limit to 5
        if (recentAnalyses.size() > 5) {
            recentAnalyses = recentAnalyses.subList(0, 5);
        }
        
        if (recentAnalyses.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<SentimentTrendDTO> trend = new ArrayList<>();
        int evalNum = 1;
        
        for (AnalysisResult analysis : recentAnalyses) {
            // Convert sentiment score (-1.0 to 1.0) to percentage (0-100)
            double sentimentScore = analysis.getSentimentScore();
            int score = (int) ((sentimentScore + 1.0) / 2.0 * 100);
            
            trend.add(SentimentTrendDTO.builder()
                    .week("Eval " + evalNum)
                    .score(score)
                    .build());
            evalNum++;
        }
        
        return trend;
    }
    
    /**
     * Calculate participation rate: (evaluations submitted / evaluations assigned) * 100
     */
    private int calculateParticipationRate(String studentId, long submittedCount) {
        // Count total assigned peer reviews for this student
        // This would ideally come from Activity assignments, but for now we'll use a heuristic
        // If student has submitted evaluations, assume they were assigned at least that many
        // In a real system, this would query Activity.participants or Assignment table
        
        // For now: If submitted > 0, calculate based on received count (peer evaluation assumption)
        long receivedCount = submissionRepository.countByTargetId(studentId);
        
        // Heuristic: Assigned reviews = received reviews (peer evaluation is typically reciprocal)
        long assignedCount = Math.max(receivedCount, submittedCount);
        
        if (assignedCount == 0) {
            return 0;
        }
        
        int rate = (int) ((double) submittedCount / assignedCount * 100);
        return Math.min(100, Math.max(0, rate));
    }
    
    public List<FeedbackHistoryDTO> getFeedbackHistory(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        log.debug("Fetching feedback history for student: {} (ID: {})", studentEmail, student.getId());
        List<EvaluationSubmission> received = submissionRepository.findByTargetId(student.getId());
        log.debug("Found {} submissions for student {}", received.size(), student.getId());
        
        if (received.isEmpty()) {
            log.debug("No feedback history found for student {}", studentEmail);
            return new ArrayList<>();
        }
        
        return received.stream()
                .sorted(Comparator.comparing(EvaluationSubmission::getSubmittedAt).reversed())
                .map(submission -> {
                    AnalysisResult analysis = submission.getAnalysisResult();
                    
                    // Determine if this is a self-evaluation
                    boolean isSelfEvaluation = submission.getEvaluator().getId().equals(submission.getTarget().getId());
                    
                    // Anonymity Rule: Only show evaluator name if it's a self-evaluation
                    String evaluatorName;
                    if (isSelfEvaluation) {
                        evaluatorName = submission.getEvaluator().getName();
                    } else {
                        evaluatorName = "Anonymous Peer";
                    }
                    
                    // Extract sentiment label from score
                    String sentimentLabel = "Neutral";
                    if (analysis != null) {
                        if (analysis.getSentimentScore() > 0.3) {
                            sentimentLabel = "Positive";
                        } else if (analysis.getSentimentScore() < -0.3) {
                            sentimentLabel = "Negative";
                        }
                    }
                    
                    // Extract primary AI sentiment tag (first non-empty tag, or "Neutral")
                    String aiSentiment = "Neutral";
                    if (analysis != null && analysis.getTags() != null && !analysis.getTags().isEmpty()) {
                        // Get the first meaningful tag, prioritizing positive ones
                        List<String> tags = analysis.getTags();
                        if (tags.contains("Positive") || tags.contains("Constructive")) {
                            aiSentiment = tags.contains("Positive") ? "Positive" : "Constructive";
                        } else if (tags.contains("Negative") || tags.contains("Vague")) {
                            aiSentiment = tags.contains("Negative") ? "Negative" : "Vague";
                        } else {
                            aiSentiment = tags.get(0); // Use first tag as fallback
                        }
                    }
                    
                    // Calculate overall score for this submission
                    List<CriterionScore> scores = scoreRepository.findBySubmissionId(submission.getId());
                    double overallScore = 0.0;
                    List<RubricScoreDTO> rubricScores = new ArrayList<>();
                    
                    if (!scores.isEmpty()) {
                        int totalScore = scores.stream().mapToInt(CriterionScore::getScore).sum();
                        int maxScore = scores.stream().mapToInt(CriterionScore::getMaxScore).sum();
                        if (maxScore > 0) {
                            overallScore = (double) totalScore / maxScore * 100;
                        }
                        
                        // Convert to DTOs
                        rubricScores = scores.stream()
                                .map(score -> RubricScoreDTO.builder()
                                        .criterionName(score.getCriterionName())
                                        .score(score.getScore())
                                        .maxScore(score.getMaxScore())
                                        .build())
                                .collect(Collectors.toList());
                    }
                    
                    return FeedbackHistoryDTO.builder()
                            .id(submission.getId())
                            .comment(submission.getComment())
                            .evaluatorName(evaluatorName)
                            .sentimentScore(analysis != null ? analysis.getSentimentScore() : 0.0)
                            .sentimentLabel(sentimentLabel)
                            .aiSentiment(aiSentiment)
                            .overallScore(overallScore)
                            .submittedAt(submission.getSubmittedAt())
                            .activityName(submission.getActivity().getName())
                            .rubricScores(rubricScores)
                            .isSelfEvaluation(isSelfEvaluation)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Generate AI Personalized Insights based on AnalysisResult tags
     * If "Constructive" appears > 3 times -> Add to Strengths
     * If "Vague" appears > 3 times -> Add to Areas for Growth
     */
    private FeedbackSummaryDTO generateAIPersonalizedInsights(String studentId) {
        // Get all AnalysisResult entries for this student (as target)
        List<EvaluationSubmission> received = submissionRepository.findByTargetId(studentId);
        
        List<String> allTags = new ArrayList<>();
        for (EvaluationSubmission submission : received) {
            AnalysisResult analysis = submission.getAnalysisResult();
            if (analysis != null && analysis.getTags() != null) {
                allTags.addAll(analysis.getTags());
            }
        }
        
        // Count tag occurrences
        long constructiveCount = allTags.stream()
                .filter(tag -> tag != null && tag.toLowerCase().contains("constructive"))
                .count();
        long vagueCount = allTags.stream()
                .filter(tag -> tag != null && tag.toLowerCase().contains("vague"))
                .count();
        long positiveCount = allTags.stream()
                .filter(tag -> tag != null && (tag.toLowerCase().contains("positive") || tag.toLowerCase().contains("encouraging")))
                .count();
        long specificCount = allTags.stream()
                .filter(tag -> tag != null && tag.toLowerCase().contains("specific"))
                .count();
        
        // Build strengths and weaknesses
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> tips = new ArrayList<>();
        
        if (constructiveCount > 3) {
            strengths.add("Receives constructive feedback consistently");
        }
        if (positiveCount > 3) {
            strengths.add("Peers provide positive and encouraging feedback");
        }
        if (specificCount > 3) {
            strengths.add("Feedback is specific and actionable");
        }
        
        if (vagueCount > 3) {
            weaknesses.add("Some feedback could be more specific");
            tips.add("Ask peers for concrete examples in their evaluations");
        }
        
        // Default values if no patterns found
        if (strengths.isEmpty()) {
            strengths.add("Continue building on your collaborative skills");
        }
        if (weaknesses.isEmpty()) {
            weaknesses.add("Focus on continuous improvement in all areas");
        }
        if (tips.isEmpty()) {
            tips.add("Engage actively in peer evaluations to improve feedback quality");
        }
        
        // Extract unique themes from tags
        List<String> themes = allTags.stream()
                .filter(tag -> tag != null && !tag.isEmpty())
                .distinct()
                .limit(5)
                .collect(Collectors.toList());
        
        if (themes.isEmpty()) {
            themes = Arrays.asList("Collaboration", "Communication", "Teamwork");
        }
        
        return FeedbackSummaryDTO.builder()
                .strengths(String.join(". ", strengths))
                .weaknesses(String.join(". ", weaknesses))
                .themes(themes)
                .tips(tips)
                .build();
    }
    
    private FeedbackSummaryDTO generateFeedbackSummary(String studentId) {
        // Fallback method - use AI insights instead
        return generateAIPersonalizedInsights(studentId);
    }
    
    /**
     * Get recent activity: last 3 evaluations received
     */
    private List<RecentActivityDTO> getRecentActivity(String studentId) {
        List<EvaluationSubmission> received = submissionRepository.findByTargetId(studentId);
        
        return received.stream()
                .sorted(Comparator.comparing(EvaluationSubmission::getSubmittedAt).reversed())
                .limit(3)
                .map(submission -> {
                    // Calculate score for this submission
                    List<CriterionScore> scores = scoreRepository.findBySubmissionId(submission.getId());
                    int score = 0;
                    if (!scores.isEmpty()) {
                        int totalScore = scores.stream().mapToInt(CriterionScore::getScore).sum();
                        int maxScore = scores.stream().mapToInt(CriterionScore::getMaxScore).sum();
                        if (maxScore > 0) {
                            score = (int) ((double) totalScore / maxScore * 100);
                        }
                    }
                    
                    String commentPreview = submission.getComment();
                    if (commentPreview != null && commentPreview.length() > 100) {
                        commentPreview = commentPreview.substring(0, 100) + "...";
                    }
                    
                    return RecentActivityDTO.builder()
                            .submissionId(submission.getId())
                            .activityName(submission.getActivity().getName())
                            .evaluatorName("Anonymous Peer")
                            .commentPreview(commentPreview)
                            .score(score)
                            .submittedAt(submission.getSubmittedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Generate personal report (PDF or text format)
     * Returns a simple text-based report for now
     */
    public byte[] generatePersonalReport(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        StudentDashboardDTO dashboard = getDashboardData(studentEmail);
        FeedbackSummaryDTO insights = dashboard.getFeedbackSummary();
        
        // Generate simple text report (can be enhanced to PDF later)
        StringBuilder report = new StringBuilder();
        report.append("=".repeat(60)).append("\n");
        report.append("APEER - Personal Performance Report\n");
        report.append("=".repeat(60)).append("\n\n");
        report.append("Student Name: ").append(student.getName()).append("\n");
        report.append("Email: ").append(student.getEmail()).append("\n");
        report.append("Report Generated: ").append(java.time.LocalDateTime.now()).append("\n\n");
        report.append("-".repeat(60)).append("\n");
        report.append("PERFORMANCE SUMMARY\n");
        report.append("-".repeat(60)).append("\n");
        report.append("Overall Score: ").append(dashboard.getOverallScore()).append("%\n");
        report.append("Participation Rate: ").append(dashboard.getParticipationRate()).append("%\n");
        report.append("Evaluations Given: ").append(dashboard.getEvaluationsGiven()).append("\n");
        report.append("Evaluations Received: ").append(dashboard.getEvaluationsReceived()).append("\n\n");
        report.append("-".repeat(60)).append("\n");
        report.append("AI-GENERATED INSIGHTS\n");
        report.append("-".repeat(60)).append("\n");
        report.append("Strengths:\n");
        if (insights != null && insights.getStrengths() != null) {
            report.append("  • ").append(insights.getStrengths()).append("\n");
        }
        report.append("\nAreas for Growth:\n");
        if (insights != null && insights.getWeaknesses() != null) {
            report.append("  • ").append(insights.getWeaknesses()).append("\n");
        }
        if (insights != null && insights.getTips() != null && !insights.getTips().isEmpty()) {
            report.append("\nRecommendations:\n");
            for (String tip : insights.getTips()) {
                report.append("  • ").append(tip).append("\n");
            }
        }
        report.append("\n").append("=".repeat(60)).append("\n");
        report.append("End of Report\n");
        report.append("=".repeat(60)).append("\n");
        
        return report.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
}

