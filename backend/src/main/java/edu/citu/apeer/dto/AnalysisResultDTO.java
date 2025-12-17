package edu.citu.apeer.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResultDTO {
    private List<String> tags;
    private Double sentimentScore;
    private Integer usefulnessScore;
    private Boolean isFlagged;
    private String flagReason;
}

