import {createContext, useContext} from "react";


type State = {
    socket: WebSocket | null;
}
const connection = new WebSocket(process.env.VITE_WS_API_URL || "ws://localhost:3000/ws");

const initialState: State = {
    socket: connection
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
    return useContext(SocketContext);

}

