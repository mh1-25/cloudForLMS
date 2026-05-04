package com.lms.lms.Services;

import com.lms.lms.DTOS.LoginRequest;
import com.lms.lms.DTOS.SignupRequest;
import com.lms.lms.DTOS.authReponse;
import com.lms.lms.Entity.User;
import com.lms.lms.Repo.UserRepository;
import com.lms.lms.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

   
    public authReponse register(SignupRequest request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstname());
        user.setLastName(request.lastname());
        user.setRole(User.Role.STUDENT); // Default role
        user.setActive(true);

        userRepository.save(user);
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        authReponse authReponse = new authReponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole().name(),
            "User registered successfully",
            token
        );

      
        return authReponse;
    }

   
    public authReponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email(),
                                request.password()
                        )
                );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(!user.isActive()) {
            throw new RuntimeException("User account is deactivated");
          }

        
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new authReponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole().name(),
            "User logged in successfully",
            token
        );
    }
}