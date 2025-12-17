package edu.citu.apeer.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationSubmissionRequest {
    private String activityId;
    private String targetStudentId;
    private String comment;
    private List<CriterionScoreRequest> scores;
}

