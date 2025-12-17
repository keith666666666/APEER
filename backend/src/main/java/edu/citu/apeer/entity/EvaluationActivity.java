package edu.citu.apeer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "evaluation_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rubric_id")
    private Rubric rubric;
    
    @Column(nullable = false)
    private LocalDateTime dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityStatus status = ActivityStatus.ACTIVE;
    
    @Column(nullable = false)
    private Integer participants = 0;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL)
    private List<EvaluationSubmission> submissions = new ArrayList<>();
}

