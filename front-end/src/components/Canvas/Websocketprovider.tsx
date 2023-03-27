import {createContext, useContext, useEffect} from "react";


type State = {
    socket: WebSocket | null;
}


const ReconnectingWebSocket = (url: string) => {
    let ws: WebSocket | null = null;
    let reconnectInterval: number;
    let reconnectAttempts = 0;

    const connect = (retry = true) => {
        ws = new WebSocket(url);
        ws.onopen = () => {
            reconnectAttempts = 0;
        };
        ws.onclose = (e) => {
            switch (e.code) {
                case 1000: // CLOSE_NORMAL
                    console.log("WebSocket: closed");
                    break;
                default: // Abnormal closure
                    reconnect(retry);
                    break;
            }
        };
        ws.onerror = (e) => {
            console.error("WebSocket error observed:", e);
            ws?.close();
        };
    }

    const reconnect = (retry = true) => {
        if (reconnectAttempts > 10) return;
        reconnectAttempts++;
        setTimeout(() => {
            console.log(`WebSocketClient: retry in ${reconnectInterval}ms`, url);
            connect(false);
        }, reconnectInterval);
        reconnectInterval = Math.min(30, (reconnectInterval || 1) * 2) * 1000;
    }

    connect();

    return ws;
}

const connection = ReconnectingWebSocket(import.meta.env.VITE_WS_API_URL || "ws://localhost:3001/ws");

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
    const {socket} = useContext(SocketContext);

    const ping = () => {
        if (!socket) return;
        socket.send(JSON.stringify({type: "ping"}));
    }


    return useContext(SocketContext);

}

