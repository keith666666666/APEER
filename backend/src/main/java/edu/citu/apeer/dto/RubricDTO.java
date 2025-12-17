package edu.citu.apeer.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubricDTO {
    private String id;
    private String name;
    private List<CriterionDTO> criteria;
}

