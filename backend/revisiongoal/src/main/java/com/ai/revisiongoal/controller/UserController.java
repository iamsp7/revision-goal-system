package com.ai.revisiongoal.controller;

import com.ai.revisiongoal.dto.LoginRequest;
import com.ai.revisiongoal.dto.LoginResponse;
import com.ai.revisiongoal.entity.User;
import com.ai.revisiongoal.exception.InvalidCredentialsException;
import com.ai.revisiongoal.exception.UserNotFoundException;
import com.ai.revisiongoal.repository.UserRepository;
import com.ai.revisiongoal.security.JwtUtil;
import com.ai.revisiongoal.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserService userService,
                          UserRepository userRepository,
                          BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ Register
    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        String token = JwtUtil.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(
                new LoginResponse(token, "Login successful")
        );
    }

    // ✅ Get All Users (Protected)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
