import Database from './database';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../repositories/user.repository';

// Инициализируем зависимости
const database = Database.getInstance();
const userRepository = new UserRepository(database);
const authController = new AuthController(userRepository);

export { database, authController };