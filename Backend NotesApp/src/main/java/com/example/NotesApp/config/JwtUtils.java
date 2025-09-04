package com.example.NotesApp.config;


import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${JWT_SECRET}")
    private String jwtSecret;
    @Value("${JWT_EXPIRATION_MS}")
    private int jwtExpirationMs;

    private Key getSigninKey(){
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }


    public String generateJwtToken(String username){
        Date now=new Date();
        Date expiry=new Date(now.getTime()+jwtExpirationMs);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigninKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigninKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken){
        try{
            Jwts.parserBuilder()
                    .setSigningKey(getSigninKey())
                    .build()
                    .parseClaimsJws(authToken);
            return  true;
        } catch (JwtException | IllegalArgumentException e) {

        }
        return false;
    }

}
