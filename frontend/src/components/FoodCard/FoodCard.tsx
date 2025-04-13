import React from 'react';
import styles from './FoodCard.module.css';
import { getImgSrc } from '../../utils/utils';

interface FoodCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
    category_name: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ id, name, description, price, category_name }) => {
    return (
        <div key={id} className={styles.foodCard}>
            <img src={getImgSrc(name)} alt={name} className={styles.foodImage} />
            <div className={styles.foodInfo}>
                <div className={styles.categoryNameContainer}>
                    {category_name}
                </div>
                <h3 className={styles.foodName}>{name}</h3>
                <p className={styles.foodDescription}>{description}</p>
                <p className={styles.foodPrice}>Цена: {price}</p>
            </div>
        </div>
    );
};

export default FoodCard;
