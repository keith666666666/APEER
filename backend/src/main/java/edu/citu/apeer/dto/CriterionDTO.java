package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriterionDTO {
    private String id;
    private String name;
    private Integer weight;
    private Integer maxScore;
}

