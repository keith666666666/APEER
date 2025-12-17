package edu.citu.apeer.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDTO {
    private String id;
    private String name;
    private String email;
    private String role;
    private String department;
    private String avatarUrl;
    private LocalDateTime joinedDate;
}

