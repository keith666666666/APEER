package edu.citu.apeer.repository;

import edu.citu.apeer.entity.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, String> {
    @Query("SELECT ar FROM AnalysisResult ar WHERE ar.submission.id = :submissionId")
    Optional<AnalysisResult> findBySubmissionId(@Param("submissionId") String submissionId);
    
    @Query("SELECT a FROM AnalysisResult a WHERE a.isFlagged = true")
    List<AnalysisResult> findAllFlagged();
    
    @Query("SELECT AVG(a.sentimentScore) FROM AnalysisResult a " +
           "WHERE a.submission.target.id = :studentId")
    Double calculateAverageSentiment(@Param("studentId") String studentId);
    
    @Query("SELECT AVG(a.usefulnessScore) FROM AnalysisResult a " +
           "WHERE a.submission.evaluator.id = :studentId")
    Double calculateAverageUsefulnessGiven(@Param("studentId") String studentId);
    
    @Query("SELECT ar FROM AnalysisResult ar WHERE ar.submission.target.id = :studentId ORDER BY ar.submission.submittedAt DESC")
    List<AnalysisResult> findTop5BySubmissionTargetIdOrderByCreatedAtDesc(@Param("studentId") String studentId);
    
    @Query("SELECT ar FROM AnalysisResult ar WHERE ar.submission.target.id = :studentId")
    List<AnalysisResult> findBySubmissionTargetId(@Param("studentId") String studentId);
}

