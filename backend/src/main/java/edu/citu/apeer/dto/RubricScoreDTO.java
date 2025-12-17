package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubricScoreDTO {
    private String criterionName;
    private Integer score;
    private Integer maxScore;
}

