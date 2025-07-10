package com.travel5.be.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${signerkey}")
    private String secretKey;

    private Key signingKey;

    @PostConstruct
    public void init() {
        signingKey = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(UserDetails userDetails) {
        Integer userId = null;
        if (userDetails instanceof com.travel5.be.security.UserDetailsImpl) {
            userId = ((com.travel5.be.security.UserDetailsImpl) userDetails).getUserId();
        }

        if (userId == null) {
            throw new IllegalArgumentException("UserDetails must contain userId");
        }

        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // ✅ subject = userId
                .claim("roles", userDetails.getAuthorities().stream()
                        .map(authority -> authority.getAuthority())
                        .toList())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 giờ
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // subject giờ là userId rồi
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String extractedUserId = extractUserId(token);

        if (userDetails instanceof com.travel5.be.security.UserDetailsImpl userDetailsImpl) {
            return extractedUserId.equals(String.valueOf(userDetailsImpl.getUserId()));
        }

        return false;
    }
}
