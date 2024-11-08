package com.yunusemrenalbant.backend.controller;

import com.yunusemrenalbant.backend.dto.request.LoginRequest;
import com.yunusemrenalbant.backend.dto.request.SignupRequest;
import com.yunusemrenalbant.backend.dto.response.CustomResponse;
import com.yunusemrenalbant.backend.dto.response.JWTResponse;
import com.yunusemrenalbant.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public CustomResponse<String> register(@RequestBody SignupRequest request) {
        return CustomResponse.created(authService.register(request));
    }

    @PostMapping("/login")
    public CustomResponse<JWTResponse> login(@RequestBody LoginRequest request) {
        return CustomResponse.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public CustomResponse<String> logout(@RequestHeader("Authorization") String token) {

        return CustomResponse.ok(authService.logout(token));
    }
}
