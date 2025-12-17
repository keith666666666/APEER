package edu.citu.apeer.repository;

import edu.citu.apeer.entity.CriterionScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CriterionScoreRepository extends JpaRepository<CriterionScore, String> {
    @Query("SELECT cs FROM CriterionScore cs WHERE cs.submission.id = :submissionId")
    List<CriterionScore> findBySubmissionId(@Param("submissionId") String submissionId);
}

