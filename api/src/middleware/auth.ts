import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction} from 'express';
import supabase from "../supabase/client";








export const authMiddleWare  = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;

    
  
    const { data, error } = await supabase.auth.getUser(token);
   
    console.log(data,error);
    if (!data) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        next();
    } catch (e) {
        res.status(401).send('Unauthorized');
    }
}