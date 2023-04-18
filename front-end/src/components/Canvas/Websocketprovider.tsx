import {createContext, useContext, useEffect} from "react";
import { client } from "../../lib/ws";


type State = {
    getClient: ()=>  WebSocket | null;
    isConnected: ()=> boolean;
    onStateChange: (cb: React.Dispatch<React.SetStateAction<any>>) => void;
}


const initialState: State = {
    getClient: client.getClient,
    isConnected: client.isConnected,
    onStateChange: client.onStateChange,
}

export const SocketContext = createContext<State>(initialState);

export default function SocketProvider ({children}: {children?: React.ReactNode}) {
    return (
        <SocketContext.Provider value={initialState}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
    return ctx;
}

