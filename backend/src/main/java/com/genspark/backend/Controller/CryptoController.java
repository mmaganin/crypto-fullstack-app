package com.genspark.backend.Controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.genspark.backend.Entity.CryptoObj;
import com.genspark.backend.Security.AppRole;
import com.genspark.backend.Security.AppUser;
import com.genspark.backend.Service.AppUserService;
import com.genspark.backend.Service.CryptoService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
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
    public List<CryptoObj> getRefreshedMarkets() {
        return cryptoService.getRefreshedMarkets();
    }

    @GetMapping("/markets")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<CryptoObj> getMarkets() {
        return cryptoService.getMarkets();
    }

    //USERS

    @GetMapping("/admin/users")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<AppUser> getUsers() {
        return appUserService.getUsers();
    }

    @PostMapping("/users")
    @CrossOrigin(origins = "http://localhost:3000")
    public AppUser saveUser(@RequestBody AppUser appUser) {
        return appUserService.saveUser(appUser);
    }

    //ROLES

    @GetMapping("/roles")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<AppRole> getRoles() {
        return appUserService.getRoles();
    }

    @PostMapping("/admin/addrole")
    @CrossOrigin(origins = "http://localhost:3000")
    public AppRole saveRole(@RequestBody AppRole appRole) {
        return appUserService.saveRole(appRole);
    }

    @PostMapping("/admin/roletouser")
    @CrossOrigin(origins = "http://localhost:3000")
    public String addRoleToUser(@RequestBody RoleToUserForm roleToUserForm) {
        appUserService.addRoleToUser(roleToUserForm.getUsername(), roleToUserForm.getRole_name());
        return "SUCCESS";
    }

//    @GetMapping("/account")
//    @CrossOrigin(origins = "http://localhost:3000")
//    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
//
//        //create utility class to get rid of repeating code
//        String authorizationHeader = request.getHeader(AUTHORIZATION);
//        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
//            try{
//                String refresh_token = authorizationHeader.substring("Bearer ".length());
//                Algorithm algorithm = Algorithm.HMAC256("secretKeyExampleMustBeMoreSecureForRealApplication".getBytes());
//                JWTVerifier verifier = JWT.require(algorithm).build();
//                DecodedJWT decodedJWT = verifier.verify(refresh_token);
//                String username = decodedJWT.getSubject();
//
//                AppUser user = appUserService.getUser(username);
//
//                String access_token = JWT.create()
//                        .withSubject(user.getUsername())
//                        .withExpiresAt(new Date(System.currentTimeMillis() + 10 * 60 * 1000)) //10 minutes access token lasts
//                        .withIssuer(request.getRequestURL().toString())
//                        .withClaim("roles", user.getRoles().stream().map(AppRole::getName).collect(Collectors.toList()))
//                        .sign(algorithm);
//
//                Map<String, String> tokens = new HashMap<>();
//                tokens.put("access_token", access_token);
//                tokens.put("refresh_token", refresh_token);
//                response.setContentType(APPLICATION_JSON_VALUE);
//                new ObjectMapper().writeValue(response.getOutputStream(), tokens);
//            } catch(Exception e){
//                response.setHeader("error", e.getMessage());
//                response.setStatus(FORBIDDEN.value());
////                    response.sendError(FORBIDDEN.value());
//                Map<String, String> error = new HashMap<>();
//                error.put("error_message", e.getMessage());
//                response.setContentType(APPLICATION_JSON_VALUE);
//                new ObjectMapper().writeValue(response.getOutputStream(), error);
//            }
//        } else {
//            throw new RuntimeException("Refresh token is missing");
//        }
//    }

//    @GetMapping("/account")
//    @CrossOrigin(origins = "http://localhost:3000")
//    public List<AppUser> getUser(@RequestBody AppUser appUser) {
//        return appUserService.getUser();
//    }
}
@Data
class RoleToUserForm {
    private String username;
    private String role_name;
}
