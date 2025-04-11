// Стандартные ошибки БД
export class DatabaseError extends Error {

    public cause?: Error;

    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }

    withCause(cause: Error): this {
        this.cause = cause;
        return this;
    }
}

export class ConnectionError extends DatabaseError {
    constructor() {
        super('Database connection failed');
        this.name = 'ConnectionError';
    }
}

export class QueryError extends DatabaseError {
    constructor(public query: string, public params: any[]) {
        super(`Query execution failed: ${query}`);
        this.name = 'QueryError';
    }
}

export class NotFoundError extends DatabaseError {
    constructor(public entity: string) {
        super(`${entity} not found`);
        this.name = 'NotFoundError';
    }
}