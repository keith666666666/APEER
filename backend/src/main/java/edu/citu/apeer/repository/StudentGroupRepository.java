package edu.citu.apeer.repository;

import edu.citu.apeer.entity.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentGroupRepository extends JpaRepository<StudentGroup, String> {
    List<StudentGroup> findAllByOrderByNameAsc();
}

