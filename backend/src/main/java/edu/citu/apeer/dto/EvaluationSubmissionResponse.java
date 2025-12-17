package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationSubmissionResponse {
    private String id;
    private String message;
    private AnalysisResultDTO analysis;
}

