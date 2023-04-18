import React, { useRef, useState, useEffect } from 'react';

const URL = import.meta.env.VITE_WS_API_URL || "ws://localhost:3001/ws"


type Listener = (args: any) => void;

type StateChangeListener<T>= React.Dispatch<React.SetStateAction<T>>

export function reconnectingSocket(url: string) {
    let client: WebSocket | null = null;
    let isConnected = false;
    let reconnectOnClose = true;
    let messageListeners: Listener[] = [];
    let stateChangeListeners: React.Dispatch<React.SetStateAction<any>>[] = [];

    function on(fn: Listener) {
        messageListeners.push(fn);
    }

    function off(fn: Listener) {
        messageListeners = messageListeners.filter(l => l !== fn);
    }

    function onStateChange(fn: React.Dispatch<React.SetStateAction<any>>) {
        stateChangeListeners.push(fn);
        return () => {
            stateChangeListeners = stateChangeListeners.filter(l => l !== fn);
        };
    }

    function start() {
        client = new WebSocket(URL);

        client.onopen = () => {
            isConnected = true;
            stateChangeListeners.forEach(fn => fn(true));
        }

        const close = client.close;

        // Close without reconnecting;
        client.close = () => {
            reconnectOnClose = false;
            close.call(client);
        }

        client.onmessage = (event) => {
            messageListeners.forEach(fn => fn(event.data));
        }

        client.onerror = (e) => console.error(e);

        client.onclose = () => {

            isConnected = false;
            stateChangeListeners.forEach(fn => fn(false));

            if (!reconnectOnClose) {
                console.log('ws closed by app');
                return;
            }

            console.log('ws closed by server');

            setTimeout(start, 3000);
        }
    }

    start();

    return {
        start,
        on,
        off,
        onStateChange,
        close: () => client?.close(),
        getClient: () => client,
        isConnected: () => isConnected,
    };
}


export const client = reconnectingSocket(URL);

export function useMessages<T>() {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        function handleMessage(message: any) {
            setMessages([...messages, message]);
        }
        client.on(handleMessage);
        return () => client.off(handleMessage);
    }, [messages, setMessages]);

    return messages;
}
