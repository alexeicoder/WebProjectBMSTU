import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
