package com.example.backendforroomresq1.RohanController;


import com.example.backendforroomresq1.Model.User;
import com.example.backendforroomresq1.dto.*;
import com.example.backendforroomresq1.security.JwtTokenProvider;
import com.example.backendforroomresq1.service.AuthService;
import com.example.backendforroomresq1.service.GoogleTokenValidator;
import com.example.backendforroomresq1.service.UserContext;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private GoogleTokenValidator googleTokenValidator;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserContext userContext;

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        // Remove "Bearer " prefix

        return ResponseEntity.ok(tokenProvider.validateToken(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        User user = authService.registerUser(request.getEmail(), request.getPassword(), request.getName(), request.getRoles(), request.getRoomno() );

        if (user != null)
            return ResponseEntity.ok("Please check your email for OTP.");

        return ResponseEntity.ofNullable("error pls check your email and password credentials");
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        System.out.println("logging in");

        response.setContentType("application/json");
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerificationRequest request) {
        boolean verified = authService.verifyEmail(request.getEmail(), request.getOtp());

        if (verified) {

            AuthResponse authResponse = authService.registerVerified(request);
            return ResponseEntity.ok(authResponse);
        }

        return ResponseEntity.badRequest().body("Invalid OTP");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email) {
        authService.resendOtp(email);
        return ResponseEntity.ok("OTP resent successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        List<User> allusers = authService.getAllUsers();
        return allusers;
    }

    @GetMapping("/getUserId/{email}")
    public ResponseEntity<Long> getUserId(@PathVariable String email) {
        System.out.println("username is " + email);
        Long userId = authService.getUserByEmail(email);
        return new ResponseEntity<>(userId, HttpStatus.OK);
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest emailReq){
        authService.sendForgotPasswordOtp(emailReq.getEmail());
        System.out.println(emailReq);
        return ResponseEntity.ok("sent forgot password otp to email");
    }

    @PostMapping("/forgotPassword/verify")
    public ResponseEntity<?> verifyFpOtp(@Valid @RequestBody VerificationRequest request) {
        System.out.println(request.getEmail());
        boolean verified = authService.verifyFpOtp(request.getEmail(), request.getOtp());

        if (verified) {

            return ResponseEntity.ok("redirecting to change password");
        }

        return ResponseEntity.badRequest().body("Invalid OTP");
    }

    @PostMapping("/forgotPassword/changePassword")
    public ResponseEntity<?> verifyChangePassword(@RequestParam String email,@RequestParam String newP, @RequestParam String confirmP){
        boolean updated = authService.updatePassword(email,newP,confirmP);

        if(updated){
            return ResponseEntity.ok("updated password pls login again");
        }

        return ResponseEntity.ok("new Password and confirm password doesn't match");
    }




    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody Map<String, String> requestBody) {
        String token = requestBody.get("token");
        System.out.println("token from requestBody is " + token);
        if (token == null || token.isEmpty()) {
            return new ResponseEntity<>("Token is missing", HttpStatus.BAD_REQUEST);
        }

        try {
            // Pass the token to your authentication service
            if(authService.authenticateWithGoogle(token)!=null)
                return new ResponseEntity<>(authService.authenticateWithGoogle(token), HttpStatus.OK);
            else{
                return new ResponseEntity<>("token not null but invalid", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing the token", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/getusername/{id}")
    public String getUserbyId(@PathVariable Long id){
        return  authService.getUserbyId(id);
    }




}

