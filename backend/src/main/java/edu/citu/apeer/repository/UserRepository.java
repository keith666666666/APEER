package edu.citu.apeer.repository;

import edu.citu.apeer.entity.User;
import edu.citu.apeer.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.status = 'ACTIVE'")
    long countByRoleAndActive(@Param("role") UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.group.id = :groupId")
    List<User> findByGroupId(@Param("groupId") String groupId);
    
    @Query("SELECT u FROM User u WHERE u.group IS NULL AND u.role = 'STUDENT'")
    List<User> findUngroupedStudents();
}

