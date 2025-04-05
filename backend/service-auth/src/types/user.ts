export interface User {
    id: number;
    login: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;

    role?: 'user' | 'admin' | 'moderator';
}

// Тип для ответа API (без пароля)
export interface SafeUser {
    id: number;
    login: string;
    email: string;
    created_at: Date;
    role?: string;
}