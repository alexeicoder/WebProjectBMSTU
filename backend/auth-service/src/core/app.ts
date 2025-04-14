import express from "express";
import { createServer, Server } from "http";
import router from "../routes/routes";
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./doc/swagger.yaml');

class App {
    private port: number = process.env.APP_PORT as unknown as number;
    private host: string = process.env.APP_HOST as unknown as string;
    private app: express.Application;
    private server: Server;

    constructor() {
        this.app = this.createApp();
        this.server = createServer(this.app);
    }

    private createApp(): express.Application {
        const app = express();

        app.use(bodyParser.json());
        app.use(cors(
            {
                origin: 'http://localhost:4000',
                methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные HTTP-методы
                credentials: true, // Разрешить отправку учётных данных
            }
        ));
        app.use(cookieParser());
        app.use("/api/auth/", router);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        return app;
    }

    public async start(): Promise<void> {
        // Starting database
        // try {
        //     await this.database.connect();
        //     const isConnected = await this.database.checkConnection();
        //     if (!isConnected) throw new Error('Database connection failed');
        // } catch (error) {
        //     console.error('Failed to start database:', error);
        //     process.exit(1);
        // }
        // Starting server
        this.server.listen(this.port, this.host, () => {
            console.log(`Auth server is running on url http://${this.host}:${this.port}/api/auth`)
        });
    }

    public async stop(): Promise<void> {
        // await this.database.disconnect();
        this.server.close();
        console.log('Server stopped');
    }
}

export default App;