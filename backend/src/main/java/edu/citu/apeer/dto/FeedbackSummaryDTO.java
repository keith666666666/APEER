package edu.citu.apeer.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackSummaryDTO {
    private String strengths;
    private String weaknesses;
    private List<String> themes;
    private List<String> tips; // AI-generated tips for improvement
}

