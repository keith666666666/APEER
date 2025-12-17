package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CriterionScoreRequest {
    private String criterionName;
    private Integer score;
}

