package com.ai.revisiongoal.confiq;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) 

            .authorizeHttpRequests(auth -> auth
                // Public APIs
                .requestMatchers("/api/users/register", "/api/users/login").permitAll()

                // Everything else under /api requires authentication
                .requestMatchers("/api/**").authenticated()

                // Allow everything else
                .anyRequest().permitAll()
            )

            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
