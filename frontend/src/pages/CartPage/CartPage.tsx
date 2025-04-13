import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext/CartContext';
import { getImgSrc } from '../../utils/utils';
import styles from './CartPage.module.css';

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
    const { cart, updateCartItemQuantity } = useCart();
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

    useEffect(() => {
        const fetchFoodItems = async () => {
            const response = await fetch('http://192.168.0.15:3200/api/food/all');
            const data = await response.json();
            setFoodItems(data.foodItems);
        };
        fetchFoodItems();
    }, []);

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        updateCartItemQuantity(productId, newQuantity);
    };

    const getFoodItemById = (productId: number) => {
        return foodItems.find((item) => item.id === productId);
    };

    return (
        <div className={styles.cartPage}>
            <h1>Корзина</h1>
            {cart.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
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
            )}
        </div>
    );
};

export default CartPage;
