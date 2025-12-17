package edu.citu.apeer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentimentTrendDTO {
    private String week;
    private Integer score;
}

