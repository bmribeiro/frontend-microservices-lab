package com.miguel.lab.users;

import java.util.List;

public record AppUser(
        Long id,
        String name,
        String email,
        String password,
        List<String> roles
) {
}
