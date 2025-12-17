package edu.citu.apeer.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDashboardDTO {
    private String id;
    private String name;
    private String email;
    private Integer overallScore;
    private Integer evaluationsGiven;
    private Integer evaluationsReceived;
    private Integer feedbackQuality;
    private Integer participationRate;
    private List<SentimentTrendDTO> sentimentTrend;
    private Integer pendingReviews;
    private String aiSummary;
    private FeedbackSummaryDTO feedbackSummary;
    private List<RecentActivityDTO> recentActivity; // Last 3 evaluations received
}

