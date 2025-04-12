import React, { memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES, SERVICE_AUTH } from '../../routes/routes';
import styles from './AppHeader.module.css';
import Button from "../Button/Button";
import axios from "axios";

interface AppHeaderProps {
    className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = memo(({ className }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(SERVICE_AUTH.SIGN_OUT, {}, {
                withCredentials: true
            });
            console.log('Вы успешно вышли из системы');
            navigate(ROUTES.WELCOME);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <header className={`${styles.appHeader} ${className || ''}`}>
            <Link to={ROUTES.HOME}>
                <div className={styles.appHeaderLogo} />
            </Link>
            <nav className={styles.appHeaderOptionsBlock}>
                <Link to={ROUTES.HOME} className={styles.appHeaderOption}>
                    <span>Главная</span>
                </Link>
                <Link to={ROUTES.SETTINGS} className={styles.appHeaderOption}>
                    <span>Настройки</span>
                </Link>
                <Button onClick={handleLogout}>Выйти</Button>
            </nav>
        </header>
    );
});

export default AppHeader;
