package com.genspark.backend.Controller;

import com.genspark.backend.Entity.AppRole;
import com.genspark.backend.Entity.AppUser;
import com.genspark.backend.Service.AppUserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * REST controller for operations requiring ROLE_ADMIN privileges
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    private final AppUserService appUserService;

    /**
     * Saves a new authorization role to DB
     *
     * @param appRole AppRole object in JSON format
     * @return REST 201 response entity with the new AppRole as body
     */
    @PostMapping("/addrole")
    public ResponseEntity<AppRole> saveRole(@RequestBody AppRole appRole) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/admin/addrole").toUriString());
        return ResponseEntity.created(uri).body(appUserService.saveRole(appRole));
    }

    /**
     * Adds an auth role to a user
     *
     * @param roleToUserForm RoleToUserForm object in JSON format
     * @return 200 OK response
     */
    @PostMapping("/roletouser")
    public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserForm roleToUserForm) {
        appUserService.addRoleToUser(roleToUserForm.getUsername(), roleToUserForm.getRole_name());
        return ResponseEntity.ok().build();
    }

    /**
     * Gets all users in the DB
     *
     * @return 200 OK REST response with users as body
     */
    @GetMapping("/users")
    public ResponseEntity<List<AppUser>> getUsers() {
        return ResponseEntity.ok().body(appUserService.getUsers());
    }

    /**
     * Saves a new AppUser in database
     *
     * @param appUser AppUser object in JSON format
     * @return 201 REST response with new user as body
     */
    @PostMapping("/users")
    public ResponseEntity<AppUser> saveUser(@RequestBody AppUser appUser) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/admin/users").toUriString());
        return ResponseEntity.created(uri).body(appUserService.saveUser(appUser));
    }
}

/**
 * Class to allow receiving JSON requests containing user's username and role_name
 */
@Data
class RoleToUserForm {
    private String username;
    private String role_name;
}
