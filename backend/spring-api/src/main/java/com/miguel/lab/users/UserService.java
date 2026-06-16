package com.miguel.lab.users;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final List<AppUser> users = List.of(
            new AppUser(
                    1L,
                    "Admin User",
                    "admin@lab.com",
                    "admin123",
                    List.of("ADMIN", "USER")
            ),
            new AppUser(
                    2L,
                    "Normal User",
                    "user@lab.com",
                    "user123",
                    List.of("USER")
            )
    );

    public Optional<AppUser> findByEmail(String email) {
        return users.stream()
                .filter(user -> user.email().equalsIgnoreCase(email))
                .findFirst();
    }

    public Optional<AppUser> findById(Long id) {
        return users.stream()
                .filter(user -> user.id().equals(id))
                .findFirst();
    }

    public List<AppUser> findAll() {
        return users;
    }
}
