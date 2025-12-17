package edu.citu.apeer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "criterion_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriterionScore {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private EvaluationSubmission submission;
    
    @Column(nullable = false)
    private String criterionName;
    
    @Column(nullable = false)
    private Integer score;
    
    @Column(nullable = false)
    private Integer maxScore;
}

