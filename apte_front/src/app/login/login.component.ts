import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'app/model/role.model';
import { User } from 'app/model/user.model';
import { UserService } from 'app/service/user.service';


@Component({
  selector: 'app-user',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

errorMessage: string;
email: string;
password: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {

  }


  login(): void {
    this.userService.authenticate(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        // Rediriger manuellement vers l'URL avec le hash
        window.location.href = 'http://localhost:4200/#/dashboard';
      },
      error => {
        this.errorMessage = 'Authentication failed';
        console.error('Login failed', error);
      }
    );
  }
  
  
}