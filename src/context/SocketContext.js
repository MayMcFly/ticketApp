import React from 'react';
import { createContext } from 'react';
import { useSocket } from '../hooks/useSocket'

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {

    let urlSocket;
    if(process.env.NODE_ENV === 'development'){
        urlSocket = 'http://localhost:3009';
    }else{
        urlSocket = 'https://ticketclient.netlify.app/';
    }

    const { socket, online } = useSocket(urlSocket);
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}