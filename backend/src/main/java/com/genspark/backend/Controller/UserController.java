package com.genspark.backend.Controller;

import com.genspark.backend.Entity.AppUserCrypto;
import com.genspark.backend.Entity.AppUser;
import com.genspark.backend.Service.AppUserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for operations requiring ROLE_USER privileges
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final AppUserService appUserService;

    /**
     * Gets a logged in user's account info
     *
     * @return 200 OK REST response with logged in AppUser as body
     */
    @GetMapping("/account")
    public ResponseEntity<AppUser> getUserInfo() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser appUser = appUserService.getUser(username);

        return ResponseEntity.ok().body(appUser);
    }

    /**
     * Updates a user's account info in DB
     *
     * @param userDetails UserDetails object in JSON format
     * @return 200 OK REST response with updated AppUser as body
     */
    @PutMapping("/account")
    public ResponseEntity<AppUser> editAccount(@RequestBody UserDetails userDetails) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!username.equals(userDetails.getUsername()))
            return ResponseEntity.unprocessableEntity().body(new AppUser());
        AppUser appUser = appUserService.getUser(username);
        appUser.setEmail(userDetails.getEmail());
        appUser.setAge(userDetails.getAge());
        appUser.setBio(userDetails.getBio());
        appUser.setName(userDetails.getName());
        appUser.setPassword(userDetails.getPassword());

        return ResponseEntity.ok().body(appUserService.saveUser(appUser));
    }

    /**
     * Updates a user's crypto portfolio in DB
     *
     * @param userPortfolioDetails UserPortfolioDetails object in JSON format
     * @return 200 OK REST response with updated AppUser as body
     */
    @PutMapping("/portfolio")
    public ResponseEntity<AppUser> editPortfolio(@RequestBody UserPortfolioDetails userPortfolioDetails) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!username.equals(userPortfolioDetails.getUsername()))
            return ResponseEntity.unprocessableEntity().body(new AppUser());

        return ResponseEntity.ok().body(appUserService.editPortfolio(username, userPortfolioDetails.getPassword(), userPortfolioDetails.getCrypto_to_add()));
    }
}

/**
 * Class to allow receiving JSON requests containing a user's specific account info
 */
@Data
@AllArgsConstructor
class UserDetails {
    private String username;
    private String password;
    private String email;
    private String bio;
    private String name;
    private int age;
}

/**
 * Class to allow receiving JSON requests containing user's username, password, and an AppUserCrypto
 */
@Data
@AllArgsConstructor
class UserPortfolioDetails {
    private String username;
    private String password;
    private AppUserCrypto crypto_to_add;
}