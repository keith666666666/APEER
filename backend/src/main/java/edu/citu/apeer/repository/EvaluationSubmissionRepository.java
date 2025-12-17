package edu.citu.apeer.repository;

import edu.citu.apeer.entity.EvaluationSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationSubmissionRepository extends JpaRepository<EvaluationSubmission, String> {
    List<EvaluationSubmission> findByEvaluatorId(String evaluatorId);
    
    @Query("SELECT s FROM EvaluationSubmission s WHERE s.target.id = :targetId")
    List<EvaluationSubmission> findByTargetId(@Param("targetId") String targetId);
    
    @Query("SELECT s FROM EvaluationSubmission s WHERE s.activity.id = :activityId")
    List<EvaluationSubmission> findByActivityId(@Param("activityId") String activityId);
    
    @Query("SELECT s FROM EvaluationSubmission s WHERE s.evaluator.id = :evaluatorId")
    List<EvaluationSubmission> findAllGivenByStudent(@Param("evaluatorId") String evaluatorId);
    
    @Query("SELECT s FROM EvaluationSubmission s WHERE s.target.id = :targetId")
    List<EvaluationSubmission> findAllReceivedByStudent(@Param("targetId") String targetId);
    
    @Query("SELECT COUNT(s) FROM EvaluationSubmission s WHERE s.evaluator.id = :userId")
    long countByEvaluatorId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(s) FROM EvaluationSubmission s WHERE s.target.id = :userId")
    long countByTargetId(@Param("userId") String userId);
    
    @Query("SELECT AVG(cs.score * 20.0) FROM CriterionScore cs " +
           "WHERE cs.submission.target.id = :studentId")
    Double calculateAverageScore(@Param("studentId") String studentId);
    
    boolean existsByEvaluatorIdAndTargetIdAndActivityId(
        String evaluatorId, String targetId, String activityId);
}

