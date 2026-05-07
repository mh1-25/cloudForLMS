package com.lms.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;

import com.lms.lms.config.AdminProperties;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.lms.lms.Clients")
@EnableConfigurationProperties(AdminProperties.class)  
public class LmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(LmsApplication.class, args);
	}

}
