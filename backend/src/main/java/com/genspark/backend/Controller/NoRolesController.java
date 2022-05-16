package com.genspark.backend.Controller;

import com.genspark.backend.Entity.AppRole;
import com.genspark.backend.Entity.AppUser;
import com.genspark.backend.Entity.CryptoObj;
import com.genspark.backend.Service.AppUserService;
import com.genspark.backend.Service.CryptoService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.List;

import static com.genspark.backend.Security.SecurityUtil.execAuthHeaderActions;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

/**
 * REST controller for operations that do not require any auth roles
 */
@RestController
@RequestMapping("/api/noroles")
@RequiredArgsConstructor
@Slf4j
public class NoRolesController {
    protected final CryptoService cryptoService;
    protected final AppUserService appUserService;

    /**
     * Updates market data in DB from coinmarketcap API
     *
     * @return 200 OK REST response with new market data as body
     */
    @PutMapping("/markets")
    public ResponseEntity<List<CryptoObj>> getRefreshedMarkets() {
        return ResponseEntity.ok().body(cryptoService.getRefreshedMarkets());
    }

    /**
     * Gets stored market data from DB
     *
     * @return 200 OK REST response with market data as body
     */
    @GetMapping("/markets")
    public ResponseEntity<List<CryptoObj>> getMarkets() {
        return ResponseEntity.ok().body(cryptoService.getMarkets());
    }

    /**
     * Creates a new user with ROLE_USER role
     *
     * @param userCreds UserCreds object in JSON format
     * @return 201 REST response with new AppUser as body
     */
    @PostMapping("/createaccount")
    public ResponseEntity<AppUser> createUser(@RequestBody UserCreds userCreds) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/noroles/createaccount").toUriString());
        if (appUserService.getUser(userCreds.getUsername()) != null)
            return ResponseEntity.unprocessableEntity().build();

        return ResponseEntity.created(uri).body(appUserService.createUser(userCreds.getUsername(), userCreds.getPassword()));
    }

    /**
     * Gets all auth roles present in the DB
     *
     * @return 200 OK REST response with the roles as body
     */
    @GetMapping("/roles")
    public ResponseEntity<List<AppRole>> getRoles() {
        return ResponseEntity.ok().body(appUserService.getRoles());
    }

    /**
     * Gets a new JWT access token from a refresh token
     *
     * @param request  incoming REST HTTP request
     * @param response outgoing REST HTTP response
     * @throws IOException
     */
    @GetMapping("/tokens/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            execAuthHeaderActions(authorizationHeader, appUserService, request, response);
        } else {
            throw new RuntimeException("Refresh token is missing");
        }
    }
}

/**
 * Class to allow receiving JSON requests containing user's username and password
 */
@Data
@AllArgsConstructor
class UserCreds {
    private String username;
    private String password;
}
