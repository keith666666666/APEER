package edu.citu.apeer.repository;

import edu.citu.apeer.entity.EvaluationActivity;
import edu.citu.apeer.entity.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationActivityRepository extends JpaRepository<EvaluationActivity, String> {
    List<EvaluationActivity> findByStatus(ActivityStatus status);
    List<EvaluationActivity> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT a FROM EvaluationActivity a WHERE a.status = 'ACTIVE' AND a.dueDate > CURRENT_TIMESTAMP")
    List<EvaluationActivity> findActiveActivities();
}

