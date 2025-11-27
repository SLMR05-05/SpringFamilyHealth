package com.example.backend.config;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {

    private final PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if(userRepository.findByEmail("admin@example.com").isEmpty()){
                User user = new User();
                user.setEmail("admin@example.com");
                user.setPasswordHash(passwordEncoder.encode("admin"));
                user.setRole("ADMIN");
                user.setName("Administrator");
                user.setPhone("0000000000");
                userRepository.save(user);

                log.warn("admin user has been created with default password: admin, please change it");
            }
        };
    }
}
