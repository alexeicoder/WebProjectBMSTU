import Database from '../core/database'; // Ваш класс для работы с БД
import {
    IOrder
} from '../interfaces/order.interfaces';

export class OrderRepository {
    constructor(private db: Database) { }

    public async findById(id: number): Promise<IOrder> {

        const result = await this.db.query(`SELECT * FROM orders WHERE id = $1`, [id]);

        return result.rows[0];
    }

    public async findByOwnerId(ownerId: number): Promise<IOrder[]> {
        const result = await this.db.query(`SELECT * FROM orders WHERE user_id = $1`, [ownerId]);
        return result.rows;
    }

    public async findByOwnerLogin(login: string): Promise<IOrder[]> {
        const result = await this.db.query(`SELECT * FROM orders WHERE user_id = $1`, [login]);
        return result.rows;
    }


}