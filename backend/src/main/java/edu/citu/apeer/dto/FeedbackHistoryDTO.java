package edu.citu.apeer.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackHistoryDTO {
    private String id;
    private String comment;
    private String evaluatorName; // "Anonymous Peer" for privacy, or actual name if self-evaluation
    private Double sentimentScore;
    private String sentimentLabel; // Positive, Neutral, Negative
    private String aiSentiment; // Primary tag from AnalysisResult (e.g., "Positive", "Constructive")
    private Double overallScore; // Calculated from criterion scores
    private LocalDateTime submittedAt;
    private String activityName;
    private List<RubricScoreDTO> rubricScores; // Individual criterion scores (renamed from scores for clarity)
    private Boolean isSelfEvaluation; // true if evaluator.id == target.id
}

