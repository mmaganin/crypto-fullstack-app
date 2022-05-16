package com.genspark.backend.Security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.genspark.backend.Security.SecurityUtil.execAuthHeaderActions;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

/**
 * Custom JWT Spring Security OncePerRequestFilter
 */
@Slf4j
public class CustomAuthorizationFilter extends OncePerRequestFilter {
    /**
     * Authorization Filter that every REST request runs through: separates login and refresh token requests from other requests and
     * handles requests with tokens in the header
     *
     * @param request     incoming REST HTTP request
     * @param response    outgoing REST HTTP response
     * @param filterChain Spring Security auth filter
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().equals("/login") || request.getServletPath().equals("/api/noroles/tokens/refresh")) {
            filterChain.doFilter(request, response);
        } else {
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                execAuthHeaderActions(authorizationHeader, request, response, filterChain);
            } else {
                filterChain.doFilter(request, response);
            }
        }
    }
}
