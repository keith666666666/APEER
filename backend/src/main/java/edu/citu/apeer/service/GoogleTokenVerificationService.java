package edu.citu.apeer.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Slf4j
public class GoogleTokenVerificationService {
    
    @Value("${google.client.id}")
    private String googleClientId;
    
    /**
     * Verify Google ID token and extract user information
     */
    public GoogleUserInfo verifyToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            
            GoogleIdToken idToken = verifier.verify(idTokenString);
            
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String picture = (String) payload.get("picture");
                
                return GoogleUserInfo.builder()
                        .email(email)
                        .name(name != null ? name : extractNameFromEmail(email))
                        .picture(picture)
                        .verified(true)
                        .build();
            } else {
                log.warn("Invalid Google ID token");
                return null;
            }
        } catch (Exception e) {
            log.error("Error verifying Google token: ", e);
            return null;
        }
    }
    
    private String extractNameFromEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "User";
        }
        String localPart = email.split("@")[0];
        return localPart.replace(".", " ");
    }
    
    @lombok.Data
    @lombok.Builder
    public static class GoogleUserInfo {
        private String email;
        private String name;
        private String picture;
        private boolean verified;
    }
}

