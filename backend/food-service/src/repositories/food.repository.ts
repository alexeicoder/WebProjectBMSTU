/* Содержит бизнес-логику, выполняет запросы к БД */

import Database from '../core/database';
import { IFood } from '../interfaces/food.interfaces';

export class FoodRepository {

    // Constuctor
    constructor(private db: Database) {
        // console.log("FoodRepository created, db:", db);
    }

    // Methods
    public async getAllFood(): Promise<IFood[]> {

        const result = await this.db.query<IFood>('SELECT * FROM food_items');

        return result.rows;
    }

    public async findById(id: number): Promise<IFood | null> {
        const result = await this.db.query<IFood>(
            'SELECT * FROM food_items WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    public async findByName(name: string): Promise<IFood[]> {
        const result = await this.db.query<IFood>(
            'SELECT * FROM food_items WHERE name ILIKE $1 LIMIT 100',
            [`%${name}%`]
        );
        return result.rows;
    }
}