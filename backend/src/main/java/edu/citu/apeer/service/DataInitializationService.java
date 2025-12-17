package edu.citu.apeer.service;

import edu.citu.apeer.entity.User;
import edu.citu.apeer.entity.UserRole;
import edu.citu.apeer.entity.UserStatus;
import edu.citu.apeer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService {
    
    private final UserRepository userRepository;
    private final RubricService rubricService;
    
    @Transactional
    public void initializeSampleData() {
        log.info("Initializing sample data...");
        
        createSampleUser("alice.student@university.edu", "Alice Chen", UserRole.STUDENT);
        createSampleUser("bob.student@university.edu", "Bob Martinez", UserRole.STUDENT);
        createSampleUser("carol.student@university.edu", "Carol Zhang", UserRole.STUDENT);
        createSampleUser("david.student@university.edu", "David Kim", UserRole.STUDENT);
        createSampleUser("emma.student@university.edu", "Emma Wilson", UserRole.STUDENT);
        createSampleUser("smith.teacher@university.edu", "Prof. Smith", UserRole.TEACHER);
        createSampleUser("admin@university.edu", "System Admin", UserRole.ADMIN);
        
        rubricService.createSampleRubrics();
        
        log.info("Sample data initialization complete");
    }
    
    private void createSampleUser(String email, String name, UserRole role) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .name(name)
                    .role(role)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(user);
            log.info("Created sample user: {}", email);
        }
    }
}

