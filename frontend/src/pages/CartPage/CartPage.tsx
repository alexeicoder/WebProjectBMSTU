import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext/CartContext';
import { getImgSrc } from '../../utils/utils';
import styles from './CartPage.module.css';
import Button from '../../components/Button/Button';

interface FoodItem {
    id: number;
    name: string;
    count: number;
    price: number;
    description: string;
    img: string;
    id_category: number;
    category_name: string;
}

const CartPage: React.FC = () => {
    const { cart, updateCartItemQuantity, clearCart } = useCart();
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFoodItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://192.168.0.15:3200/api/food/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch food items');
                }
                const data = await response.json();
                setFoodItems(data.foodItems);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFoodItems();
    }, []);

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        updateCartItemQuantity(productId, newQuantity);
    };

    const getFoodItemById = (productId: number) => {
        return foodItems.find((item) => item.id === productId);
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Prepare the data for the request
            const orderItems = cart.map((cartItem) => {
                const foodItem = getFoodItemById(cartItem.productId);
                return {
                    id: foodItem?.id,
                    name: foodItem?.name,
                    price: foodItem?.price,
                    count: cartItem.quantity,
                    id_category: foodItem?.id_category,
                    category_name: foodItem?.category_name
                };
            });

            const orderData = {
                ownerId: 1, // Replace with the actual user ID
                foodItems: orderItems,
            };

            // Simulate the request to the backend
            const response = await fetch('http://192.168.0.15:3200/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            // Handle successful order placement
            console.log('Order placed successfully');
            clearCart();
            // You might want to redirect the user to a confirmation page here
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.cartPage}>
                <h1>Корзина</h1>
                {cart.length === 0 ? (
                    <p>Корзина пуста</p>
                ) : (
                    <>
                        <ul className={styles.cartList}>
                            {cart.map((cartItem) => {
                                const foodItem = getFoodItemById(cartItem.productId);
                                if (!foodItem) {
                                    return null;
                                }
                                return (
                                    <li key={cartItem.productId} className={styles.cartItem}>
                                        <img src={getImgSrc(foodItem.name)} alt={foodItem.name} className={styles.cartItemImage} />
                                        <div className={styles.cartItemInfo}>
                                            <h3 className={styles.cartItemName}>{foodItem.name}</h3>
                                            <p className={styles.cartItemPrice}>Цена: {foodItem.price}</p>
                                            <div className={styles.quantityControl}>
                                                <button onClick={() => handleQuantityChange(cartItem.productId, cartItem.quantity - 1)} disabled={cartItem.quantity <= 1}>-</button>
                                                <span>{cartItem.quantity}</span>
                                                <button onClick={() => handleQuantityChange(cartItem.productId, cartItem.quantity + 1)} disabled={cartItem.quantity >= foodItem.count}>+</button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <Button onClick={handlePlaceOrder} className={'signinBtn'} disabled={isLoading}>
                            Сделать заказ
                        </Button>
                    </>
                )}
                {isLoading && <div>Загрузка...</div>}
                {error && <div>{error}</div>}
            </div>
        </>
    );
};

export default CartPage;
