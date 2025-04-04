import dotenv from 'dotenv';
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
import authRoutes from './routes/auth_routes'; // Используем import для auth_routes

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: 'http://192.168.0.15:4000', // Разрешить запросы с любых доменов
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные HTTP-методы
        credentials: true, // Разрешить отправку учётных данных
    }
));

// Подключение маршрутов
app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes);

export default app;