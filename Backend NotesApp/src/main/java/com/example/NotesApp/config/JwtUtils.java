package com.example.NotesApp.config;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {


    private String jwtSecret="my_super_secure_jwt_secret_key_2024!";

    private int jwtExpirationMs=3600000;

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
