package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserStatusRequest {
    private String status; // "Active" or "Inactive"
}

