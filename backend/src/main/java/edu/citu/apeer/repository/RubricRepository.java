package edu.citu.apeer.repository;

import edu.citu.apeer.entity.Rubric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RubricRepository extends JpaRepository<Rubric, String> {
    Optional<Rubric> findByName(String name);
    List<Rubric> findAllByOrderByCreatedAtDesc();
    boolean existsByName(String name);
}

