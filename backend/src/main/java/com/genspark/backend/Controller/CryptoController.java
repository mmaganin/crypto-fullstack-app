package com.genspark.backend.Controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.genspark.backend.Entity.AppUserCrypto;
import com.genspark.backend.Entity.CryptoObj;
import com.genspark.backend.Entity.AppRole;
import com.genspark.backend.Entity.AppUser;
import com.genspark.backend.Service.AppUserService;
import com.genspark.backend.Service.CryptoService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
@Slf4j
public class CryptoController {
    private final CryptoService cryptoService;
    private final AppUserService appUserService;

    //MARKETS

    @PutMapping("/markets")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<CryptoObj>> getRefreshedMarkets() {
        return ResponseEntity.ok().body(cryptoService.getRefreshedMarkets());
    }

    @GetMapping("/markets")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<CryptoObj>> getMarkets() {
        return ResponseEntity.ok().body(cryptoService.getMarkets());
    }

    //USERS

    @GetMapping("/admin/users")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<AppUser>> getUsers() {
        return ResponseEntity.ok().body(appUserService.getUsers());
    }

    @PostMapping("/admin/users")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<AppUser> saveUser(@RequestBody AppUser appUser) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/users").toUriString());

        return ResponseEntity.created(uri).body(appUserService.saveUser(appUser));
    }

    @PostMapping("/createaccount")
    @CrossOrigin(origins = "http://localhost:3000")
    //HttpServletRequest request, HttpServletResponse response
    public ResponseEntity<AppUser> createUser(@RequestBody UserCreds userCreds) throws IOException {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/createaccount").toUriString());

        if (appUserService.getUser(userCreds.getUsername()) != null)
            return ResponseEntity.unprocessableEntity().build();

        Collection<AppRole> roles = new ArrayList<>();
        AppRole userRole = new AppRole(0, "ROLE_USER");
        for (AppRole appRole : appUserService.getRoles()) {
            if (appRole.getName().equals("ROLE_USER")) {
                userRole = appRole;
            }
        }
        roles.add(userRole);
        AppUser appUser = new AppUser(0, userCreds.getUsername(), userCreds.getPassword(), "",
                        "", "", -1, new ArrayList<>(), roles);

        return ResponseEntity.created(uri).body(appUserService.saveUser(appUser));

    }

    @GetMapping("/account")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<AppUser> getUserInfo() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser appUser = appUserService.getUser(username);

        return ResponseEntity.ok().body(appUser);
    }

    @PostMapping("/account")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<UserDetails> editAccount(@RequestBody UserDetails userDetails) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!username.equals(userDetails.getUsername())) return ResponseEntity.unprocessableEntity().body(userDetails);

        AppUser appUser = appUserService.getUser(username);
        appUser.setEmail(userDetails.getEmail());
        appUser.setAge(userDetails.getAge());
        appUser.setBio(userDetails.getBio());
        appUser.setName(userDetails.getName());
        appUser.setPassword(userDetails.getPassword());
        appUserService.saveUser(appUser);

        return ResponseEntity.ok().body(userDetails);
    }

    @PostMapping("/portfolio")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<UserPortfolioDetails> editPortfolio(@RequestBody UserPortfolioDetails userPortfolioDetails) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!username.equals(userPortfolioDetails.getUsername())) return ResponseEntity.unprocessableEntity().body(userPortfolioDetails);

        AppUser appUser = appUserService.getUser(username);
        Collection<AppUserCrypto> appUserCryptos =  appUser.getCrypto_in_portfolio();

        boolean addNewCrypto = true;
        float newQuantity = 0;
        AppUserCrypto newCryptoToAdd = userPortfolioDetails.getCrypto_to_add();
        AppUserCrypto placeholder = new AppUserCrypto();
        for(AppUserCrypto appUserCrypto : appUserCryptos){
            if(appUserCrypto.getSlug().equals(newCryptoToAdd.getSlug())){
                if((newQuantity = newCryptoToAdd.getQuantity() + appUserCrypto.getQuantity()) < 0){
                    newQuantity = 0;
                }
                placeholder = appUserCrypto;
                addNewCrypto = false;
                break;
            }
        }

        if(addNewCrypto){
            if(newCryptoToAdd.getQuantity() > 0){
                appUserCryptos.add(newCryptoToAdd);
            }
        } else {
            appUserCryptos.remove(placeholder);

                placeholder.setQuantity(newQuantity);
                appUserCryptos.add(placeholder);

        }

        appUser.setPassword(userPortfolioDetails.getPassword());
        appUser.setCrypto_in_portfolio(appUserCryptos);
        appUserService.saveUser(appUser);

        return ResponseEntity.ok().body(userPortfolioDetails);
    }

    //ROLES

    @GetMapping("/roles")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<AppRole>> getRoles() {
        return ResponseEntity.ok().body(appUserService.getRoles());
    }

    @PostMapping("/admin/addrole")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<AppRole> saveRole(@RequestBody AppRole appRole) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/admin/addrole").toUriString());
        return ResponseEntity.created(uri).body(appUserService.saveRole(appRole));
    }

    @PostMapping("/admin/roletouser")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserForm roleToUserForm) {
        appUserService.addRoleToUser(roleToUserForm.getUsername(), roleToUserForm.getRole_name());
        return ResponseEntity.ok().build();
    }

    //TOKENS

    @GetMapping("/tokens/refresh")
    @CrossOrigin(origins = "http://localhost:3000")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {

        //create utility class to get rid of repeating code
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                String refresh_token = authorizationHeader.substring("Bearer ".length());
                Algorithm algorithm = Algorithm.HMAC256("secretKeyExampleMustBeMoreSecureForRealApplication".getBytes());
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(refresh_token);
                String username = decodedJWT.getSubject();

                AppUser user = appUserService.getUser(username);

                String access_token = JWT.create()
                        .withSubject(user.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) //60 minutes access token lasts
                        .withIssuer(request.getRequestURL().toString())
                        .withClaim("roles", user.getRoles().stream().map(AppRole::getName).collect(Collectors.toList()))
                        .sign(algorithm);

                Map<String, String> tokens = new HashMap<>();
                tokens.put("access_token", access_token);
                tokens.put("refresh_token", refresh_token);
                response.setContentType(APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), tokens);
            } catch (Exception e) {
                response.setHeader("error", e.getMessage());
                response.setStatus(FORBIDDEN.value());
//                    response.sendError(FORBIDDEN.value());
                Map<String, String> error = new HashMap<>();
                error.put("error_message", e.getMessage());
                response.setContentType(APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), error);
            }
        } else {
            throw new RuntimeException("Refresh token is missing");
        }
    }
}

@Data
class RoleToUserForm {
    private String username;
    private String role_name;
}

@Data
@AllArgsConstructor
class UserCreds {
    private String username;
    private String password;
}

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

@Data
@AllArgsConstructor
class UserPortfolioDetails {
    private String username;
    private String password;
    private AppUserCrypto crypto_to_add;
}