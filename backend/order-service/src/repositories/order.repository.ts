import Database from '../core/database'; // Ваш класс для работы с БД
import {
    IOrder,
    IOrderItem,
    IOrderWithItems,
    ICreateOrderData,
    IUpdateOrderStatusData,
    IOrderFilterOptions
} from '../interfaces/order.interfaces';

export class OrderRepository {
    constructor(private db: Database) { }

    /**
     * Найти заказ по ID с детализацией товаров
     */
    public async findOrderWithItems(orderId: number): Promise<IOrderWithItems | null> {
        const orderResult = await this.db.query<IOrder>(
            `SELECT * FROM orders WHERE order_id = $1`,
            [orderId]
        );

        if (!orderResult.rows[0]) {
            return null;
        }

        const itemsResult = await this.db.query<IOrderItem>(
            `SELECT oi.*, fi.name, fi.image_url 
       FROM order_items oi
       JOIN food_items fi ON oi.item_id = fi.item_id
       WHERE oi.order_id = $1`,
            [orderId]
        );

        return {
            ...orderResult.rows[0],
            items: itemsResult.rows
        };
    }

    /**
     * Создать новый заказ
     */
    public async createOrder(orderData: ICreateOrderData): Promise<number> {
        const { userId, deliveryAddress, deliveryPhone, items, ...rest } = orderData;

        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Создаем запись заказа
            const orderResult = await client.query<{ order_id: number }>(
                `INSERT INTO orders (
          user_id, delivery_address, delivery_phone, 
          total_amount, payment_method, delivery_notes
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING order_id`,
                [
                    userId,
                    deliveryAddress,
                    deliveryPhone,
                    rest.totalAmount,
                    rest.paymentMethod,
                    rest.deliveryNotes || null
                ]
            );

            const orderId = orderResult.rows[0].order_id;

            // 2. Добавляем товары в заказ
            for (const item of items) {
                await client.query(
                    `INSERT INTO order_items (
            order_id, item_id, quantity, price_at_order, special_requests
          ) VALUES ($1, $2, $3, $4, $5)`,
                    [
                        orderId,
                        item.itemId,
                        item.quantity,
                        item.price,
                        item.specialRequests || null
                    ]
                );
            }

            await client.query('COMMIT');
            return orderId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Обновить статус заказа
     */
    public async updateOrderStatus(data: IUpdateOrderStatusData): Promise<void> {
        await this.db.query(
            `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE order_id = $2`,
            [data.status, data.orderId]
        );
    }

    /**
     * Найти заказы пользователя
     */
    public async findUserOrders(userId: number, limit = 10, offset = 0): Promise<IOrder[]> {
        const result = await this.db.query<IOrder>(
            `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY order_date DESC
       LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );
        return result.rows;
    }

    /**
     * Найти заказы по фильтрам (для админки)
     */
    public async findOrdersByFilter(filter: IOrderFilterOptions): Promise<IOrder[]> {
        let query = `SELECT * FROM orders WHERE 1=1`;
        const params: any[] = [];
        let paramIndex = 1;

        if (filter.status) {
            query += ` AND status = $${paramIndex++}`;
            params.push(filter.status);
        }

        if (filter.userId) {
            query += ` AND user_id = $${paramIndex++}`;
            params.push(filter.userId);
        }

        if (filter.dateFrom) {
            query += ` AND order_date >= $${paramIndex++}`;
            params.push(filter.dateFrom);
        }

        if (filter.dateTo) {
            query += ` AND order_date <= $${paramIndex++}`;
            params.push(filter.dateTo);
        }

        query += ` ORDER BY order_date DESC`;

        if (filter.limit) {
            query += ` LIMIT $${paramIndex++}`;
            params.push(filter.limit);
        }

        const result = await this.db.query<IOrder>(query, params);
        return result.rows;
    }

    /**
     * Назначить курьера на заказ
     */
    public async assignCourier(orderId: number, courierId: number): Promise<void> {
        await this.db.query(
            `UPDATE orders 
       SET courier_id = $1, status = 'processing', updated_at = CURRENT_TIMESTAMP
       WHERE order_id = $2 AND status = 'pending'`,
            [courierId, orderId]
        );
    }

    /**
     * Получить статистику по заказам
     */
    public async getOrderStats(): Promise<{
        totalOrders: number;
        totalRevenue: number;
        avgOrderValue: number;
    }> {
        const result = await this.db.query<{
            total_orders: string;
            total_revenue: string;
            avg_order_value: string;
        }>(
            `SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as avg_order_value
       FROM orders
       WHERE status != 'cancelled'`
        );

        return {
            totalOrders: parseInt(result.rows[0].total_orders),
            totalRevenue: parseFloat(result.rows[0].total_revenue),
            avgOrderValue: parseFloat(result.rows[0].avg_order_value)
        };
    }
}