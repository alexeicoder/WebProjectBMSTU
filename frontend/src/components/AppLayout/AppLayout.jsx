import React from "react";
import { Outlet } from 'react-router-dom';
import AppHeader from '../AppHeader/AppHeader';
import PageLayout from "../PageLayout/PageLayout.jsx";

function AppLayout() {
    return (
        <>
            <AppHeader />
            <PageLayout>
                <Outlet />
            </PageLayout>
        </>
    );
};

export default AppLayout;