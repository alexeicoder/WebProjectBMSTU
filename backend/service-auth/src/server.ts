import dotenv from 'dotenv';
dotenv.config();
// console.log(process.env)

import app from './app';
import { createServer } from 'http';

// import * as dotenv from 'dotenv';

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const server = createServer(app);

console.log("PORT", PORT);
console.log("HOST", HOST);

server.listen(Number(PORT), String(HOST), () => {
    console.log(`Server ready at http://${HOST}:${PORT}/api/auth`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Обработка ошибок при запуске
server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${PORT} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
});