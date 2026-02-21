package com.ai.revisiongoal.confiq;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ai.revisiongoal.security.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthFilter extends OncePerRequestFilter {
	@Override
	protected void doFilterInternal(
	        HttpServletRequest request,
	        HttpServletResponse response,
	        FilterChain filterChain
	) throws ServletException, IOException {

	    String authHeader = request.getHeader("Authorization");

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        filterChain.doFilter(request, response);
	        return;
	    }

	    String token = authHeader.substring(7);

	    try {

	        if (!JwtUtil.isExpired(token) &&
	            SecurityContextHolder.getContext().getAuthentication() == null) {

	            String username = JwtUtil.extractUsername(token);
	            String role = JwtUtil.extractRole(token);

	            UsernamePasswordAuthenticationToken authentication =
	                    new UsernamePasswordAuthenticationToken(
	                            username,
	                            null,
	                            List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
	                    );

	            authentication.setDetails(
	                    new WebAuthenticationDetailsSource().buildDetails(request)
	            );

	            SecurityContextHolder.getContext().setAuthentication(authentication);
	        }

	    } catch (Exception e) {
	        SecurityContextHolder.clearContext();
	    }

	    filterChain.doFilter(request, response);
	}
}