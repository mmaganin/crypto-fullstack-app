package com.genspark.backend.Security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor //injects dependencies
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserDetailsService userDetailsService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        //how to look for users
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //sets location to receive auth requests with no blocks

        http.cors().and();
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManagerBean());
        customAuthenticationFilter.setFilterProcessesUrl("/login");

        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(STATELESS);
//        http.authorizeRequests().anyRequest().permitAll();
        //"/token/refresh/**"
        http.authorizeRequests().antMatchers("/tokens/refresh").permitAll();
        http.authorizeRequests().antMatchers("/markets").permitAll();
        http.authorizeRequests().antMatchers("/createaccount").permitAll();
        http.authorizeRequests().antMatchers("/admin/**").hasAnyAuthority("ROLE_ADMIN");
        http.authorizeRequests().antMatchers("/account", "/portfolio").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN");

//        http.authorizeRequests().antMatchers("/account").permitAll();
        //http.authorizeRequests().antMatchers("/portfolio").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN");

//        http.authorizeRequests().antMatchers("/token/refresh/**").permitAll();
//        http.authorizeRequests().antMatchers(GET, "/account/**").hasAnyAuthority("ROLE_USER");
        http.authorizeRequests().anyRequest().authenticated();
        http.addFilter(new CustomAuthenticationFilter(authenticationManagerBean()));
        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    //allows usage of auth manager bean in config
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://pro-api.coinmarketcap.com"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT"));
        configuration.applyPermitDefaultValues();
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
