package edu.citu.apeer.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateActivityRequest {
    private String name;
    private String rubricId;
    private String dueDate; // ISO format
    private List<String> participantIds;
}

