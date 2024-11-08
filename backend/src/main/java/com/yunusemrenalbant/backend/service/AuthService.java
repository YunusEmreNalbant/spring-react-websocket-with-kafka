package com.yunusemrenalbant.backend.service;

import com.yunusemrenalbant.backend.dto.request.LoginRequest;
import com.yunusemrenalbant.backend.dto.request.SignupRequest;
import com.yunusemrenalbant.backend.dto.response.JWTResponse;

public interface AuthService {
    String register(SignupRequest request);
    JWTResponse login(LoginRequest request);
    String logout(String token);
}
