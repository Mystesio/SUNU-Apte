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

  users: User[] = [];
  selectedUser: User | null = null;
  error: string | null = null;
  user: User = {
    id: 0,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: Role.USER
  }
  errorMessage: string;
email: string;
password: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      data => this.users = data,
      err => this.error = err.message
    );
  }

  viewUser(id: number): void {
    this.userService.getUserById(id).subscribe(
      data => this.selectedUser = data,
      err => this.error = err.message
    );
  }

  addUser(user: User): void {
    this.userService.createUser(user).subscribe(
      data => this.loadUsers(),
      err => this.error = err.message
    );
  }

  updateUser(user: User): void {
    if (user.id) {
      this.userService.updateUser(user.id, user).subscribe(
        data => this.loadUsers(),
        err => this.error = err.message
      );
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => this.loadUsers(),
      err => this.error = err.message
    );
  }


  login(): void {
    this.userService.authenticate(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/dashboard']);

      },
      error => {
        this.errorMessage = 'Authentication failed';
        console.error('Login failed', error);
      }
    );
  }
}