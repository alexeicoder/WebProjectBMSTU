import React, { useEffect, useState } from 'react';
import styles from './OrderPage.module.css';
import { useCart } from '../../context/CartContext/CartContext';
import OrderCard from '../../components/OrderCard/OrderCard';
import PageLayout from '../../components/PageLayout/PageLayout';
import FormMessageBlock from '../../components/FormMessageBlock/FormMessageBlock';

interface IOrderItem {
    id: number;
    id_order: number;
    id_food_item: number;
    count: number;
    price: number;
    name: string;
    img: string;
}

interface IOrder {
    id: number;
    user_id: number;
    update_date: Date;
    total_price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    order_date: Date;
    order_items?: IOrderItem[];
}

const OrderPage: React.FC = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { cart } = useCart();
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const validateResponse = await fetch('http://192.168.0.15:3000/api/auth/validatetoken', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!validateResponse.ok) {
                    throw new Error('Не удалось проверить токен. Пожалуйста, войдите снова.');
                }

                const validateResponseData = await validateResponse.json();
                setUserId(validateResponseData.userId);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch user ID.');
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://192.168.0.15:3100/api/order/find/owner/id/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data.orders);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return (
            <PageLayout>
                <FormMessageBlock message={error} type='error' />
            </PageLayout>
        );
    }

    return (
        <div className={styles.orderPage}>
            <h1>Ваши заказы</h1>
            {orders.length === 0 ? (
                <p>У вас пока нет заказов</p>
            ) : (
                <ul className={styles.orderList}>
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderPage;
