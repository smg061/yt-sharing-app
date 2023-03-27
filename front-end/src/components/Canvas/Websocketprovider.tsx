import {createContext, useContext, useEffect} from "react";
import {  client } from "../../lib/ws";


type State = {
    getClient: ()=>  WebSocket | null;
    isConnected: ()=> boolean;
    onStateChange: (cb: React.Dispatch<React.SetStateAction<any>>) => void;
}


// const ReconnectingWebSocket = (url: string) => {
//     let ws: WebSocket | null = null;
//     let reconnectInterval: number;
//     let reconnectAttempts = 0;

//     const connect = (retry = true) => {
//         ws = new WebSocket(url);
//         ws.onopen = () => {
//             reconnectAttempts = 0;
//         };
//         ws.onclose = (e) => {
//             console.log("WebSocketClient: closed", e.code, e.reason);
//             if (retry) reconnect();
//         };
//         ws.onerror = (e) => {
//             console.error("WebSocket error observed:", e);
//             ws?.close();
//         };
//     }

//     const reconnect = (retry = true) => {
//         console.log(reconnectAttempts, "reconnectAttempts");
//         if (reconnectAttempts > 10) return;
//         reconnectAttempts++;
//         setTimeout(() => {
//             console.log(`WebSocketClient: retry in ${reconnectInterval}ms`, url);
//             connect(retry);
//         }, reconnectInterval);
//         reconnectInterval = Math.min(30, (reconnectInterval || 1) * 2) * 1000;
//     }

//     connect();

//     return ws;
// }


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

    return useContext(SocketContext);

}

