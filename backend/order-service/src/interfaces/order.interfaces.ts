export interface IOrder {
    id: number;
    user_id: number;
    update_date: Date;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_date: Date;
}

export interface IOrderItem {
    id: number;
    id_order: number;
    id_food_item: number;
    count: number;
}