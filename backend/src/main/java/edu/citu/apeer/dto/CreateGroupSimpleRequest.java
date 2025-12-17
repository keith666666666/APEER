package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateGroupSimpleRequest {
    private String name;
    private String activityId; // Optional - can be null for general groups
}

