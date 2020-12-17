export interface User {
    email: string;
    password: string;
}

export interface UserResponse{
     auth: boolean;
     token: string;
     name: string;
     email: string;
}

export interface LoginErrorMessage {
    status: number
    message: string
  }