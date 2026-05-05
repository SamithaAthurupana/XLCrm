package com.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MiniCrmApplication {
    public static void main(String[] args) {
        SpringApplication.run(MiniCrmApplication.class, args);
    }
}
