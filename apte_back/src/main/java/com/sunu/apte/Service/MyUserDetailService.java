package com.sunu.apte.Service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sunu.apte.Entity.User;
import com.sunu.apte.Repository.UserRepository;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Rechercher l'utilisateur dans la base de données en fonction de son email
        User user = userRepository.findByEmail(email);

        if (user != null) {
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
        } else {
            throw new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email);
        }
    }
        
    public boolean authenticate(String email, String password) {
        UserDetails userDetails = loadUserByUsername(email);
        return passwordEncoder.matches(password, userDetails.getPassword());
    }
}

