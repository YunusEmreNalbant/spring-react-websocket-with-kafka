package com.yunusemrenalbant.backend.service;

import com.yunusemrenalbant.backend.model.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long userId);
}
