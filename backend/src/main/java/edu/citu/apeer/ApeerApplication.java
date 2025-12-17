package edu.citu.apeer;

import edu.citu.apeer.service.DataInitializationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@RequiredArgsConstructor
@Slf4j
public class ApeerApplication {
    
    private final DataInitializationService dataInitService;
    
    public static void main(String[] args) {
        SpringApplication.run(ApeerApplication.class, args);
        log.info("=".repeat(80));
        log.info("APEER Backend is running on http://localhost:8080");
        log.info("API Documentation: http://localhost:8080/api");
        log.info("=".repeat(80));
    }
    
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            log.info("Starting data initialization...");
            dataInitService.initializeSampleData();
            log.info("Data initialization complete");
        };
    }
}

