// Getting data from .env
import dotenv from 'dotenv';
dotenv.config();

import App from "./core/app";
import { database } from './core/container';

database.checkConnection()
    .then(isConnected => {
        if (!isConnected) throw new Error('Database connection failed');
        console.log("DB", database);
        const app = new App();
        app.start();
    })
    .catch(error => {
        console.error('Failed to start:', error);
        process.exit(1);
    });

// // Обработка Ctrl+C
// process.on('SIGINT', async () => {
//     await app.stop();
//     process.exit(0);
// });

// // Обработка других сигналов завершения
// process.on('SIGTERM', async () => {
//     await app.stop();
//     process.exit(0);
// });