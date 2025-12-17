package edu.citu.apeer.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupDTO {
    private String id;
    private String name;
    private List<UserDTO> members;
    private Integer memberCount;
}

