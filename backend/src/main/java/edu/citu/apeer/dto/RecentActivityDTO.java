package edu.citu.apeer.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentActivityDTO {
    private String submissionId;
    private String activityName;
    private String evaluatorName; // "Anonymous Peer"
    private String commentPreview; // First 100 chars
    private Integer score;
    private LocalDateTime submittedAt;
}

