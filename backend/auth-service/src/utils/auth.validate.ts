/**
 * Валидирует логин (должен быть email)
 * @param login Логин для проверки
 * @returns true если валидный, false если нет
 */
export const validateLogin = (login: string): boolean => {
    // Проверяем, что строка не пустая и содержит @
    if (!login || !login.includes('@')) {
        return false;
    }

    // Дополнительные проверки для email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(login);
};

/**
 * Валидирует пароль
 * @param password Пароль для проверки
 * @returns true если валидный, false если нет
 */
export const validatePassword = (password: string): boolean => {
    // Проверяем, что пароль не пустой и не содержит пробелов
    if (!password || password.includes(' ')) {
        return false;
    }

    // Дополнительные проверки (можно добавить сложность)
    return password.length > 0;
};