export interface User {
    email: string;
    password: string;
    name?: string;
}

export interface UserResponse {
    auth: boolean;
    token: string;
    name: string;
    email: string;
}

export interface LoginErrorMessage {
    status: number
    message: string
}

export interface SignUpResponse {
    message: string
    body: User
}