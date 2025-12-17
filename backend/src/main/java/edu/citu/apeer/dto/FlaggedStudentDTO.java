package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlaggedStudentDTO {
    private String id;
    private String name;
    private String reason;
    private String severity; // HIGH, MEDIUM, LOW
}

