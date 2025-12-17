package edu.citu.apeer.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateGroupRequest {
    private String name;
    private List<String> memberIds;
}

