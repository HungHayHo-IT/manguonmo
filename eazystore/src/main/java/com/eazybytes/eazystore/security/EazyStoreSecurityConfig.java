package com.eazybytes.eazystore.security;

import com.eazybytes.eazystore.filter.JWTTokenValidatorFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.password.CompromisedPasswordChecker;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.password.HaveIBeenPwnedRestApiPasswordChecker;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class EazyStoreSecurityConfig {

    private final List<String> publicPaths;

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Tắt CSRF để API POST hoạt động
                .csrf(csrfConfig -> csrfConfig.disable())

                .cors(corsConfig -> corsConfig.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests((requests) -> {
                            // 1. Cho phép các đường dẫn public (Login, Register...)
                            publicPaths.forEach(path -> requests.requestMatchers(path).permitAll());

                            // 2. CẤU HÌNH QUYỀN CHO PRODUCT (Đây là phần bạn đang thiếu)
                            // Cho phép ai cũng xem được danh sách (GET)
                            requests.requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll();

                            // Chỉ ADMIN được Thêm (POST), Sửa (PUT), Xóa (DELETE)
                            // Dùng hasAnyAuthority để bắt được cả "ADMIN" và "ROLE_ADMIN"
                            requests.requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN");
                            requests.requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN");
                            requests.requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN");

                            // 3. Các cấu hình admin khác
                            requests.requestMatchers("/api/v1/admin/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN");
                            requests.requestMatchers("/eazystore/actuator/**").hasAnyAuthority("OPS_ENG");
                            requests.requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").hasAnyAuthority("DEV_ENG", "QA_ENG");

                            // 4. Các request còn lại yêu cầu đăng nhập (USER hoặc ADMIN)
                            requests.anyRequest().hasAnyAuthority("USER", "ADMIN", "ROLE_USER", "ROLE_ADMIN");
                        }
                )
                .addFilterBefore(new JWTTokenValidatorFilter(publicPaths), BasicAuthenticationFilter.class)
                .formLogin(withDefaults())
                .httpBasic(withDefaults()).build();
    }

    // ... (Các @Bean khác giữ nguyên như cũ)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationProvider authenticationProvider) {
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CompromisedPasswordChecker compromisedPasswordChecker() {
        return new HaveIBeenPwnedRestApiPasswordChecker();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Cổng Frontend
        config.setAllowedMethods(Collections.singletonList("*")); // Cho phép tất cả: GET, POST, PUT, DELETE...
        config.setAllowedHeaders(Collections.singletonList("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}