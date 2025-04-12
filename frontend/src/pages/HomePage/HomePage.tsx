// import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ROUTES } from '../../routes/routes';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './HomePage.module.css';

interface FoodItem {
    id: number;
    name: string;
    count: number;
    price: number;
    description: string;
    img: string;
}

function HomePage() {
    const [foodItems, setFoodItems] = useState<FoodItem[] | null>(null); // Changed initial state to null
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://192.168.0.15:3200/api/food/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch food items');
                }
                const data = await response.json();

                // Check if data is an array before setting the state
                console.log(data)
                if (Array.isArray(data.foodItems)) {
                    setFoodItems(data.foodItems);
                } else {
                    throw new Error('Data received is not an array');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
                setFoodItems([]); // Set to empty array on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Check if foodItems is null before mapping
    if (!foodItems) {
        return <div>Загрузка...</div>;
    }

    return (
        <PageLayout>
            <div className={styles.foodGrid}>
                {foodItems.map((item) => (
                    <div key={item.id} className={styles.foodCard}>
                        <img src={item.img} alt={item.name} className={styles.foodImage} />
                        <div className={styles.foodInfo}>
                            <h3 className={styles.foodName}>{item.name}</h3>
                            <p className={styles.foodDescription}>{item.description}</p>
                            <p className={styles.foodPrice}>Price: {item.price}</p>
                            <p className={styles.foodCount}>Count: {item.count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
}

export default HomePage;
