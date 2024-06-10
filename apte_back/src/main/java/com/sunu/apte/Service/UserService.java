package com.sunu.apte.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sunu.apte.Entity.User;
import com.sunu.apte.Repository.UserRepository;


@Service
public class UserService {

	 @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private PasswordEncoder passwordEncoder;

	    public List<User> getAllUsers() {
	        return userRepository.findAll();
	    }

	    public User createUser(User user) {
	        user.setPassword(passwordEncoder.encode(user.getPassword()));
	        return userRepository.save(user);
	    }

	    public Optional<User> getUserById(Long id) {
	        return userRepository.findById(id);
	    }

	    public Optional<User> updateUser(Long id, User userUpdate) {
	        Optional<User> optionalUser = userRepository.findById(id);
	        if (optionalUser.isPresent()) {
	            User user = optionalUser.get();
	            user.setEmail(userUpdate.getEmail());
	            if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
	                user.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
	            }
	            user.setFirstName(userUpdate.getFirstName());
	            user.setLastName(userUpdate.getLastName());
	            user.setRole(userUpdate.getRole());
	            return Optional.of(userRepository.save(user));
	        } else {
	            return Optional.empty();
	        }
	    }

	    public boolean deleteUser(Long id) {
	        Optional<User> optionalUser = userRepository.findById(id);
	        if (optionalUser.isPresent()) {
	            userRepository.delete(optionalUser.get());
	            return true;
	        } else {
	            return false;
	        }
	    }
}
