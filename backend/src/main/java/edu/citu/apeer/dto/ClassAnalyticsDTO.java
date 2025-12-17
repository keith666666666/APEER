package edu.citu.apeer.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassAnalyticsDTO {
    private String name;
    private Integer totalStudents;
    private Double averageScore;
    private Double classAverage;
    private Integer submissionRate;
    private Integer biasFlags;
    private List<FlaggedStudentDTO> flaggedStudents;
}

