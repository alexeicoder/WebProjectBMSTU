import React, { useEffect, useState, memo, useContext } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { ROUTES, SERVICE_AUTH } from '../../constants/routes.js';
import styles from './AppHeader.module.css';
import Button from "../Button/Button.jsx";
import axios from "axios";

function AppHeader() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Отправляем запрос на сервер для выхода
            await axios.post(SERVICE_AUTH.SIGN_OUT, {}, {
                withCredentials: true
            });
            console.log('Вы успешно вышли из системы');
            // navigate(ROUTES.WELCOME);

            // Перенаправляем пользователя на страницу входа
            // window.location.href = '/login';
        } catch (error) {
            console.error('Ошибка при выходе:', error.response);
        }
    };

    return (
        <div className={styles.appHeader}>
            <Link to={ROUTES.HOME}>
                <div className={styles.appHeaderLogo} />
            </Link>
            <div className={styles.appHeaderOptionsBlock}>
                <a href={ROUTES.HOME}>
                    <div className={styles.appHeaderOption}>
                        <span>Главная</span>
                    </div>
                </a>
                <a href={ROUTES.SETTINGS}>
                    <div className={styles.appHeaderOption}>
                        <span>Настройки</span>
                    </div>
                </a>
                <Button onClick={handleLogout}>Выйти</Button>
            </div>
        </div>
    )
}

export default AppHeader;