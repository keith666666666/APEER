package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDTO {
    private String id;
    private String name;
    private String rubricId;
    private String dueDate; // ISO format
    private String status;
    private Integer participants;
    private Integer submissionCount; // Number of submissions received
    private Integer totalParticipants; // Total number of participants
}

