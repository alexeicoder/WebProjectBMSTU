// import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ROUTES } from '../../routes/routes';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './HomePage.module.css';
import FormMessageBlock from '../../components/FormMessageBlock/FormMessageBlock';
import Button from '../../components/Button/Button';
import { getImgSrc } from '../../utils/utils';
import FoodCard from '../../components/FoodCard/FoodCard';

interface FoodItem {
    id: number;
    name: string;
    count: number;
    price: number;
    description: string;
    img: string;
    id_category: number; // Add id_category
    category_name: string;
}

interface Category {
    id: number;
    name: string;
}

function HomePage() {
    const [foodItems, setFoodItems] = useState<FoodItem[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://192.168.0.15:3200/api/food/all');
                if (!response.ok) {
                    throw new Error('Не удалось загрузить список продуктов. Попробуйте позже');
                }
                const data = await response.json();

                if (Array.isArray(data.foodItems)) {
                    setFoodItems(data.foodItems);
                } else {
                    throw new Error('Data received is not an array');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
                setFoodItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://192.168.0.15:3200/api/food/category/all'); // Replace with your actual endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data.foodCategories);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchData();
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
    };

    const filteredFoodItems = selectedCategory
        ? foodItems?.filter((item) => item.id_category === selectedCategory)
        : foodItems;

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

    if (!foodItems) {
        return <div>Загрузка...</div>;
    }

    return (
        <>

            <div className={styles.categoryButtons}>
                <Button
                    className={`${styles.categoryButton} ${selectedCategory === null ? styles.active : ''}`}
                    onClick={() => handleCategoryClick(null)}
                >
                    Все
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>
            <PageLayout>
                <div className={styles.foodGrid}>
                    {filteredFoodItems?.map((item) => (
                        <FoodCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            category_name={item.category_name}
                        />
                    ))}
                </div>
            </PageLayout>
        </>
    );
}

export default HomePage;
