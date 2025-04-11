/* Содержит бизнес-логику, выполняет запросы к БД */

import Database from '../core/database';
import { IUser } from '../interfaces/auth.interfaces';

export class UserRepository {

    // Constuctor
    constructor(private db: Database) {
        // console.log("UserRepository created, db:", db);
    }

    // Methods
    public async findByLogin(login: string): Promise<IUser | null> {
        const result = await this.db.query<IUser>(
            'SELECT * FROM users WHERE login = $1',
            [login]
        );
        return result.rows[0] || null;
    }

    public async findById(id: number): Promise<IUser | null> {
        const result = await this.db.query<IUser>(
            'SELECT id, login, name FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    public async createUser(login: string, password: string, name: string): Promise<number> {
        const result = await this.db.query<{ id: number }>(
            `INSERT INTO users (login, password, name) 
             VALUES ($1, $2, $3) RETURNING id`,
            [login, password, name]
        );
        return result.rows[0].id;
    }

    public async getAllUsers(): Promise<IUser[]> {
        const result = await this.db.query<IUser>('SELECT * FROM users');
        return result.rows;
    }
}