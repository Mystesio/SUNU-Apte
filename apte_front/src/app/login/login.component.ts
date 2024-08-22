import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  ngOnInit(): void {}

  login(): void {
    this.userService.authenticate(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        // Utilisez le Router pour naviguer vers le Dashboard
        this.router.navigate(['/dashboard']).then(() => {
          // Après la navigation, forcer une actualisation
          window.location.reload();
        });
      },
      error => {
        this.errorMessage = 'Authentication failed';
        console.error('Login failed', error);
      }
    );
  }
}