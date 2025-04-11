import Database from '../core/database';
import { User } from '../interfaces/auth.interfaces';

export class UserRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    public async findByLogin(login: string): Promise<User | null> {
        const result = await this.db.query<User>(
            'SELECT * FROM users WHERE login = $1',
            [login]
        );
        return result.rows[0] || null;
    }

    public async findById(id: number): Promise<User | null> {
        const result = await this.db.query<User>(
            'SELECT id, login, name FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    public async createUser(
        login: string,
        password: string,
        name: string
    ): Promise<number> {
        const result = await this.db.query<{ id: number }>(
            `INSERT INTO users (login, password, name) 
             VALUES ($1, $2, $3) RETURNING id`,
            [login, password, name]
        );
        return result.rows[0].id;
    }

    public async getAllUsers(): Promise<User[]> {
        const result = await this.db.query<User>('SELECT * FROM users');
        return result.rows;
    }
}