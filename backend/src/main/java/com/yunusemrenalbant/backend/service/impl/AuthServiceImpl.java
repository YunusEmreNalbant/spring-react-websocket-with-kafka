package com.yunusemrenalbant.backend.service.impl;

import com.yunusemrenalbant.backend.dto.request.LoginRequest;
import com.yunusemrenalbant.backend.dto.request.SignupRequest;
import com.yunusemrenalbant.backend.dto.response.JWTResponse;
import com.yunusemrenalbant.backend.exception.EmailAlreadyExistsException;
import com.yunusemrenalbant.backend.exception.UserNotFoundException;
import com.yunusemrenalbant.backend.model.User;
import com.yunusemrenalbant.backend.repository.UserRepository;
import com.yunusemrenalbant.backend.security.jwt.JwtUtils;
import com.yunusemrenalbant.backend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    private final JwtUtils jwtUtils;

    public AuthServiceImpl(PasswordEncoder passwordEncoder, UserRepository userRepository, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public String register(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }


        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        return "success";
    }

    @Override
    public JWTResponse login(LoginRequest request) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());

        Authentication auth = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwtToken = jwtUtils.generateJwtToken(auth);

        userRepository.findByEmail(request.getEmail()).orElseThrow(UserNotFoundException::new);

        return JWTResponse.builder()
                .email(request.getEmail())
                .token(jwtToken)
                .build();
    }

    @Override
    public String logout(String token) {
        String authToken = jwtUtils.extractTokenFromHeader(token);

        if (jwtUtils.validateJwtToken(authToken)) {
            return "success";
        }

        return "failed";
    }
}
