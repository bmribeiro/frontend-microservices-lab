package com.miguel.lab.users;

import com.miguel.lab.auth.AuthUserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/users")
    public List<AuthUserResponse> users() {
        return userService.findAll()
                .stream()
                .map(UserController::toResponse)
                .toList();
    }

    @GetMapping("/api/users/{id}")
    public AuthUserResponse userById(@PathVariable Long id) {
        return userService.findById(id)
                .map(UserController::toResponse)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    private static AuthUserResponse toResponse(AppUser user) {
        return new AuthUserResponse(
                user.id(),
                user.name(),
                user.email(),
                user.roles()
        );
    }
}
