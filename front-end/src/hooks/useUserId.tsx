import { nanoid } from "nanoid";
import { useEffect, useState } from "react"

export const useId = ()=> {
    const [id, setId] = useState<string>('');

    useEffect(()=> {
        const idFromStorage = localStorage.getItem('userId');
        if(!idFromStorage) {
            const generatedId = nanoid();
            localStorage.setItem('userId', id);
            setId(generatedId)
        } else {
            setId(idFromStorage);
        }
    },[])

    return id
}