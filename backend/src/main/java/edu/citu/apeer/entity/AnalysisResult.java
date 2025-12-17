package edu.citu.apeer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "analysis_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private EvaluationSubmission submission;
    
    @ElementCollection
    @CollectionTable(name = "comment_tags", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    @Column(nullable = false)
    private Double sentimentScore; // -1.0 to 1.0
    
    @Column(nullable = false)
    private Integer usefulnessScore; // 0 to 100
    
    @Column(nullable = false)
    private Boolean isFlagged = false;
    
    @Column(length = 500)
    private String flagReason;
    
    @CreationTimestamp
    private LocalDateTime analyzedAt;
}

