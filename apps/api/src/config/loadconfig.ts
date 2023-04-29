
import dotenv from 'dotenv';

export const loadConfig = () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';

    if (process.env.NODE_ENV === 'development') {
        const envFound = dotenv.config();
        if (envFound.error) {
            throw new Error("Couldn't find .env file");
        }
    }
    return;
}


