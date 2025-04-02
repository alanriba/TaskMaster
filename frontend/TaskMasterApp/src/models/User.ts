export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }