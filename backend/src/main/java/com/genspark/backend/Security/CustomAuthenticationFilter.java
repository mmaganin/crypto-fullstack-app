package com.genspark.backend.Security;

import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

import static com.genspark.backend.Security.SecurityUtil.*;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

/**
 * Custom JWT Spring Security UsernamePasswordAuthenticationFilter
 */
@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    /**
     * attempts authentication with username and password from URL encoded form obtained from requests using /login URI
     *
     * @param request  incoming REST HTTP request
     * @param response outgoing REST HTTP response
     * @return Authentication object to be used in successfulAuthentication()
     * @throws AuthenticationException
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        log.info("Username: {}", username);
        log.info("Password: {}", password);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        return authenticationManager.authenticate(authenticationToken);
    }

    /**
     * generates 200 OK REST response containing JWT access and refresh tokens upon successful authentication
     *
     * @param request        incoming REST HTTP request
     * @param response       outgoing REST HTTP response
     * @param chain          Spring Security auth filter
     * @param authentication auth object from attemptAuthentication
     * @throws IOException
     * @throws ServletException
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        User user = (User) authentication.getPrincipal();
        Algorithm algorithm = jwtAlgorithm;
        String access_token = generateJWTToken(user.getUsername(), user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList()), request.getRequestURL().toString(), algorithm, true);
        String refresh_token = generateJWTToken(user.getUsername(), null, request.getRequestURL().toString(), algorithm, false);

        Map<String, String> tokens = createTokensBody(access_token, refresh_token);
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), tokens);
    }
}
