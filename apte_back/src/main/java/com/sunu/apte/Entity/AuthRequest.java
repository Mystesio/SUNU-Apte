package com.sunu.apte.Entity;


public class AuthRequest {

    private String email;
    private String password;

    // Constructeur par défaut
    public AuthRequest() {}

    // Getters et setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
}