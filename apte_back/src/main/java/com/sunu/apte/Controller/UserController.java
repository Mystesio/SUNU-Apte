package com.sunu.apte.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sunu.apte.Entity.AuthRequest;
import com.sunu.apte.Entity.User;
import com.sunu.apte.Service.MyUserDetailService;
import com.sunu.apte.Service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

	 @Autowired
	 private UserService userService;
	 
	 @Autowired
	    private MyUserDetailService myUserDetailService;

	    @GetMapping("/list")
	    public List<User> getAllUsers() {
	        return userService.getAllUsers();
	    }

	    @PostMapping("/create")
	    public User createUser(@RequestBody User user) {
	        return userService.createUser(user);
	    }

	    @GetMapping("/user/{id}")
	    public ResponseEntity<User> getUserById(@PathVariable Long id) {
	        Optional<User> optionalUser = userService.getUserById(id);
	        if (optionalUser.isPresent()) {
	            return ResponseEntity.ok(optionalUser.get());
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }

	    @PutMapping("/update/{id}")
	    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userUpdate) {
	        Optional<User> optionalUser = userService.updateUser(id, userUpdate);
	        if (optionalUser.isPresent()) {
	            return ResponseEntity.ok(optionalUser.get());
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }

	    @DeleteMapping("/delete/{id}")
	    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
	        boolean isDeleted = userService.deleteUser(id);
	        if (isDeleted) {
	            return ResponseEntity.ok().build();
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	    
	    @PostMapping("/authenticate")
	    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {
	        boolean isAuthenticated = myUserDetailService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
	        
	        if (isAuthenticated) {
	            return ResponseEntity.ok("Authentication successful");
	        } else {
	            return ResponseEntity.status(401).body("Authentication failed");
	        }
	    }
	}



