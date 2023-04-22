import { Request, Response, NextFunction} from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const authMiddleWare  = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer').pop()?.trim() as string;
    if (!token) {
        return res.status(400).send('Bad request');
    }
    try {
        const user = jwt.verify(token, process.env.SUPABASE_JWT_SECRET ??'') as JwtPayload;
        if (!user) {
         res.status(401).send('Unauthorized');
         return;
        }
        next();
    }
    catch (e) {
           res.status(401).send('Unauthorized');
           return;
    }
}