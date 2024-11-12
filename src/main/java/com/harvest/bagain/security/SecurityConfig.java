package com.harvest.bagain.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@Configuration
public class SecurityConfig {

    @Bean
    private SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 사용 안 함 (JWT 방식)
            .authorizeHttpRequests(auth -> auth // HTTP 요청 인증
                .requestMatchers("/users/info").authenticated() // 해당 엔드포인트에 인증 요구
                .anyRequest().permitAll() // 나머지 요청은 인증 없이 접근 허용
            )
            .addFilterBefore(new JwtTokenFilter(), UsernamePasswordAuthenticationFilter.class); // JwtTokenFilter를 인증 필터 이전에 추가

        return http.build();
    }
}
