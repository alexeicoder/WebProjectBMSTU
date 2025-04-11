export interface IOrder {
    id: number;
    user_id: number;
    delivery_address: string;
    delivery_date: string;
    courier_id: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    created_at: Date;
}

export interface IOrderItem {
    id: number;
    order_id: number;
    item_id: number;
    quantity: number;
    price_at_order: number;
    special_requests?: string;
    name?: string; // Дополнительное поле из JOIN
    image_url?: string; // Дополнительное поле из JOIN
}

export interface IOrderWithItems extends IOrder {
    items: IOrderItem[];
}

export interface ICreateOrderData {
    userId: number;
    deliveryAddress: string;
    deliveryPhone: string;
    totalAmount: number;
    paymentMethod: 'card' | 'cash' | 'online';
    deliveryNotes?: string;
    items: Array<{
        itemId: number;
        quantity: number;
        price: number;
        specialRequests?: string;
    }>;
}

export interface IUpdateOrderStatusData {
    orderId: number;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface IOrderFilterOptions {
    status?: string;
    userId?: number;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
}