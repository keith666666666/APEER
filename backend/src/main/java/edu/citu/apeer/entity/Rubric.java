package edu.citu.apeer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rubrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rubric {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @OneToMany(mappedBy = "rubric", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RubricCriterion> criteria = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}

