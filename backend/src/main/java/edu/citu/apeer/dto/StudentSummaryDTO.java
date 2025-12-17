package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSummaryDTO {
    private String id;
    private String name;
    private String email;
    private Integer overallScore;
    private Integer evaluationsGiven;
    private Integer evaluationsReceived;
    private Integer feedbackQuality;
    private Integer participationRate;
    private Boolean isBiased;
    private Double biasScore;
    private Integer pendingReviews;
}

