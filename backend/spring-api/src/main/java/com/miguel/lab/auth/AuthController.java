package com.miguel.lab.auth;

import com.miguel.lab.security.JwtService;
import com.miguel.lab.users.AppUser;
import com.miguel.lab.users.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final long expirationMinutes;

    public AuthController(
            UserService userService,
            JwtService jwtService,
            @Value("${app.security.jwt.expiration-minutes}") long expirationMinutes
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.expirationMinutes = expirationMinutes;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        AppUser user = userService.findByEmail(request.email())
                .orElseThrow(AuthController::invalidCredentials);

        if (!user.password().equals(request.password())) {
            throw invalidCredentials();
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                "Bearer",
                expirationMinutes * 60,
                toResponse(user)
        );
    }

    @GetMapping("/me")
    public AuthUserResponse me(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");

        AppUser user = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        return toResponse(user);
    }

    private static AuthUserResponse toResponse(AppUser user) {
        return new AuthUserResponse(
                user.id(),
                user.name(),
                user.email(),
                user.roles()
        );
    }

    private static ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid credentials"
        );
    }
}
