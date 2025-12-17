package edu.citu.apeer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    private EvaluationActivity activity;
    
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private List<User> members = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}

