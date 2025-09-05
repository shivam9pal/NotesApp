package com.example.NotesApp.controller;


import com.example.NotesApp.config.JwtUtils;
import com.example.NotesApp.models.Users;
import com.example.NotesApp.repository.UserRepository;
import com.example.NotesApp.request.JwtResponse;
import com.example.NotesApp.request.LoginRequest;
import com.example.NotesApp.request.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtils jwtUtils;


    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils,UserRepository userRepository,
                          PasswordEncoder passwordEncoder){
        this.authenticationManager=authenticationManager;
        this.userRepository=userRepository;
        this.jwtUtils=jwtUtils;
        this.passwordEncoder=passwordEncoder;
    }




    @PostMapping("/test-register")
    public ResponseEntity<String> testRegister() {
        return ResponseEntity.ok("Test endpoint works!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req){
        if(userRepository.existsByUsername(req.username())){
            return ResponseEntity.badRequest().body("USname Already Exists");
        }

        Users user= new Users();
        user.setUsername(req.username());
        user.setPassword(passwordEncoder.encode(req.password()));
        userRepository.save(user);
        return ResponseEntity.ok("User Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req){
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.username(), req.password())
            );
            String token = jwtUtils.generateJwtToken(req.username());
            return ResponseEntity.ok(new JwtResponse(token, req.username()));
        }catch(BadCredentialsException e){
                return ResponseEntity.status(401).body("Invalid Credentials");
        }

    }



}
