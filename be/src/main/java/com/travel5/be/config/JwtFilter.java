package com.travel5.be.config;

import com.travel5.be.security.UserDetailsImpl;
import com.travel5.be.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Bypass websocket
        if (path.startsWith("/ws-chat")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bypass các public API
        if (
                path.startsWith("/assets/") ||
                        path.startsWith("/auth/") ||
                        path.startsWith("/api/auth/") ||
                        path.startsWith("/api/dashboard/") ||
                        path.equals("/users/register") ||
                        path.startsWith("/users/check-username")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            String userIdStr = jwtUtil.extractUserId(jwt);

            if (userIdStr != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    Integer userId = Integer.parseInt(userIdStr);
                    UserDetails userDetails = userDetailsService.loadUserById(userId);

                    if (jwtUtil.isTokenValid(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                } catch (NumberFormatException e) {
                    // token không hợp lệ
                }
            }
        }

        filterChain.doFilter(request, response);
    }

}
