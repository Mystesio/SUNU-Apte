import { Role } from "./role.model";

export class User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role:Role
  
    constructor(
      id: number,
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      role:Role
   
    ) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.firstName = firstName;
      this.lastName = lastName;
      this.role= role;
     
    }
  }
  