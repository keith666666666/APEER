package edu.citu.apeer.service;

import edu.citu.apeer.dto.*;
import edu.citu.apeer.entity.*;
import edu.citu.apeer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RubricService {
    
    private final RubricRepository rubricRepository;
    private final RubricCriterionRepository criterionRepository;
    
    public List<RubricDTO> getAllRubrics() {
        return rubricRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public RubricDTO getRubricById(String id) {
        Rubric rubric = rubricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubric not found"));
        return convertToDTO(rubric);
    }
    
    @Transactional
    public void createSampleRubrics() {
        if (!rubricRepository.existsByName("Team Collaboration")) {
            Rubric teamRubric = Rubric.builder()
                    .name("Team Collaboration")
                    .build();
            teamRubric = rubricRepository.save(teamRubric);
            
            createCriterion(teamRubric, "Communication", 30, 5);
            createCriterion(teamRubric, "Contribution", 40, 5);
            createCriterion(teamRubric, "Reliability", 30, 5);
        }
        
        if (!rubricRepository.existsByName("Code Quality")) {
            Rubric codeRubric = Rubric.builder()
                    .name("Code Quality")
                    .build();
            codeRubric = rubricRepository.save(codeRubric);
            
            createCriterion(codeRubric, "Clean Code", 35, 5);
            createCriterion(codeRubric, "Documentation", 25, 5);
            createCriterion(codeRubric, "Testing", 40, 5);
        }
        
        if (!rubricRepository.existsByName("Presentation Skills")) {
            Rubric presentRubric = Rubric.builder()
                    .name("Presentation Skills")
                    .build();
            presentRubric = rubricRepository.save(presentRubric);
            
            createCriterion(presentRubric, "Clarity", 40, 5);
            createCriterion(presentRubric, "Engagement", 30, 5);
            createCriterion(presentRubric, "Content", 30, 5);
        }
    }
    
    private void createCriterion(Rubric rubric, String name, int weight, int maxScore) {
        RubricCriterion criterion = RubricCriterion.builder()
                .rubric(rubric)
                .name(name)
                .weight(weight)
                .maxScore(maxScore)
                .build();
        criterionRepository.save(criterion);
    }
    
    private RubricDTO convertToDTO(Rubric rubric) {
        List<CriterionDTO> criteria = rubric.getCriteria().stream()
                .map(c -> CriterionDTO.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .weight(c.getWeight())
                        .maxScore(c.getMaxScore())
                        .build())
                .collect(Collectors.toList());
        
        return RubricDTO.builder()
                .id(rubric.getId())
                .name(rubric.getName())
                .criteria(criteria)
                .build();
    }
}

