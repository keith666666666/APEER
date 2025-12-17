package edu.citu.apeer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rubric_criteria")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubricCriterion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer weight;
    
    @Column(nullable = false)
    private Integer maxScore;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubric_id")
    private Rubric rubric;
}

