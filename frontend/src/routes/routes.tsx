export const enum ROUTES {
    WELCOME = '/',
    HOME = '/home',
    SIGN_IN = '/signin',
    SIGN_UP = '/register',
    FEED = '/feed',
    PROFILE = '/profile/',
    SETTINGS = '/settings',
    BOOKS = '/books',
    FRIENDS = '/friends',
    BOOK_VIEW = '/book/view/',
    AUTHOR_VIEW = '/author/view/',
    SERIES_VIEW = '/series/view',
}

const SERVICE_AUTH_BASE_URL = 'http://192.168.0.15:3000/api/auth';

export const enum SERVICE_AUTH {
    LOGIN = SERVICE_AUTH_BASE_URL + '/login',
    REGISTER = SERVICE_AUTH_BASE_URL + '/register',
    VALIDATE_TOKEN = SERVICE_AUTH_BASE_URL + '/validatetoken',
    REFRESH_TOKEN = SERVICE_AUTH_BASE_URL + '/refresh',
    GET_DATA = SERVICE_AUTH_BASE_URL + '/data',
    SIGN_OUT = SERVICE_AUTH_BASE_URL + '/signout'
}


// BACKEND_URL = 'http://192.168.0.15:5000';