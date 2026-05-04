package com.lms.lms.Contoller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.lms.DTOS.LoginRequest;
import com.lms.lms.DTOS.SignupRequest;
import com.lms.lms.DTOS.authReponse;
import com.lms.lms.Services.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor    
public class Authcontroller {
    private final AuthService authService;


    @PostMapping("/signup")
    public ResponseEntity<authReponse> register(@RequestBody @Valid SignupRequest request) {
           
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    
    public ResponseEntity<authReponse> login(@RequestBody @Valid LoginRequest request) {
        
        return ResponseEntity.ok( authService.login(request));
    }
}
    
