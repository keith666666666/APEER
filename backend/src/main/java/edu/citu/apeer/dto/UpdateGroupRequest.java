package edu.citu.apeer.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateGroupRequest {
    private String name;
    private List<String> memberIds; // Replace all members
}

