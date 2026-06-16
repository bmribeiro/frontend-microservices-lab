package com.miguel.lab.auth;

import java.util.List;

public record AuthUserResponse(
        Long id,
        String name,
        String email,
        List<String> roles
) {
}
