export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface TokenPayload {
    userId: number;
}

export interface User {
    id: number;
    login: string;
    password: string;
    name?: string;
}

export interface AuthRequest extends Request {
    userId?: number;
}