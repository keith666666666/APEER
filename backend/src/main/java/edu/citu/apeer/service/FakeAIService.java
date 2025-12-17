package edu.citu.apeer.service;

import edu.citu.apeer.dto.AnalysisResultDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
public class FakeAIService {
    
    private final Random random = new Random();
    
    public AnalysisResultDTO analyzeComment(String comment) {
        log.info("Analyzing comment with Fake AI Service: {}", 
                 comment.substring(0, Math.min(50, comment.length())));
        
        List<String> tags = generateTags(comment);
        Double sentimentScore = calculateSentiment(comment);
        Integer usefulnessScore = calculateUsefulness(comment);
        Boolean isFlagged = shouldFlag();
        String flagReason = isFlagged ? generateFlagReason() : null;
        
        return AnalysisResultDTO.builder()
                .tags(tags)
                .sentimentScore(sentimentScore)
                .usefulnessScore(usefulnessScore)
                .isFlagged(isFlagged)
                .flagReason(flagReason)
                .build();
    }
    
    private List<String> generateTags(String comment) {
        List<String> tags = new ArrayList<>();
        
        if (comment.length() > 100) {
            tags.add("Detailed");
        }
        
        if (comment.length() < 30) {
            tags.add("Vague");
        } else if (comment.length() > 50) {
            tags.add("Constructive");
        }
        
        if (comment.toLowerCase().contains("good") || 
            comment.toLowerCase().contains("great") ||
            comment.toLowerCase().contains("excellent")) {
            tags.add("Positive");
        }
        
        if (comment.toLowerCase().contains("improve") ||
            comment.toLowerCase().contains("better") ||
            comment.toLowerCase().contains("should")) {
            tags.add("Actionable");
        }
        
        if (comment.toLowerCase().contains("thank") ||
            comment.toLowerCase().contains("appreciate")) {
            tags.add("Polite");
        }
        
        if (tags.isEmpty()) {
            tags.add("Neutral");
        }
        
        return tags;
    }
    
    private Double calculateSentiment(String comment) {
        String lowerComment = comment.toLowerCase();
        
        int positiveWords = 0;
        int negativeWords = 0;
        
        String[] positive = {"good", "great", "excellent", "outstanding", 
                            "helpful", "clear", "strong", "effective"};
        for (String word : positive) {
            if (lowerComment.contains(word)) positiveWords++;
        }
        
        String[] negative = {"poor", "bad", "weak", "unclear", 
                            "confusing", "inadequate", "lacking"};
        for (String word : negative) {
            if (lowerComment.contains(word)) negativeWords++;
        }
        
        int total = positiveWords + negativeWords;
        if (total == 0) {
            return 0.0;
        }
        
        double score = (double) (positiveWords - negativeWords) / total;
        score += (random.nextDouble() - 0.5) * 0.2;
        
        return Math.max(-1.0, Math.min(1.0, score));
    }
    
    private Integer calculateUsefulness(String comment) {
        int baseScore = 50;
        
        if (comment.length() > 150) {
            baseScore += 20;
        } else if (comment.length() > 80) {
            baseScore += 10;
        } else if (comment.length() < 30) {
            baseScore -= 20;
        }
        
        String[] actionableWords = {"should", "could", "improve", "consider", 
                                   "suggest", "recommend", "try", "focus"};
        for (String word : actionableWords) {
            if (comment.toLowerCase().contains(word)) {
                baseScore += 5;
                break;
            }
        }
        
        if (comment.toLowerCase().contains("example") || 
            comment.toLowerCase().contains("instance")) {
            baseScore += 10;
        }
        
        baseScore += random.nextInt(21) - 10;
        
        return Math.max(0, Math.min(100, baseScore));
    }
    
    private Boolean shouldFlag() {
        return random.nextDouble() < 0.10;
    }
    
    private String generateFlagReason() {
        String[] reasons = {
            "Potential grade inflation detected",
            "Score deviation > 2.5σ from class average",
            "Comment lacks substantive feedback",
            "Possible friendship bias detected",
            "Statistical anomaly in scoring pattern"
        };
        return reasons[random.nextInt(reasons.length)];
    }
    
    public String generateSummary(List<String> comments) {
        if (comments.isEmpty()) {
            return "No feedback available yet.";
        }
        
        String[] templates = {
            "Consistently provides constructive and detailed feedback.",
            "Shows good understanding but could provide more specific examples.",
            "Demonstrates strong analytical skills in peer evaluations.",
            "Needs improvement in providing specific actionable feedback.",
            "Well-balanced evaluations with helpful suggestions.",
            "Exceptional feedback quality with balanced tone."
        };
        
        return templates[random.nextInt(templates.length)];
    }
}

