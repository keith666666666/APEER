package edu.citu.apeer.repository;

import edu.citu.apeer.entity.RubricCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RubricCriterionRepository extends JpaRepository<RubricCriterion, String> {
    List<RubricCriterion> findByRubricId(String rubricId);
}

