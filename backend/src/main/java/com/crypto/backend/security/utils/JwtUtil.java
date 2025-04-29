package com.crypto.backend.security.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil
{
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor("your_secret_key_here_your_secret_key_here".getBytes(StandardCharsets.UTF_8));

    public String generateToken(long customerId)
    {
        return Jwts.builder()
                .setSubject(String.valueOf(customerId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractCustomerId(String token)
    {
        return getClaims(token).getSubject();
    }

    private Claims getClaims(String token)
    {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
