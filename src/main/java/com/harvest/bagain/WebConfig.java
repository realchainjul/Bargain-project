package com.harvest.bagain;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
                		.allowedOrigins("*") 
                		//.allowedOrigins("https://bargainus.kr") 
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // HTTP 메소드 제한
                        .allowedHeaders("*") // 모든 헤더 허용
                        .allowCredentials(true); // 자격 증명(쿠키, 인증 헤더 등) 포함을 허용
            }
        };
    }
}
