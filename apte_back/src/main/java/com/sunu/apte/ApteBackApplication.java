package com.sunu.apte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.sunu.apte")
public class ApteBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApteBackApplication.class, args);
	}

}
