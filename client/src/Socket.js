import {io} from "socket.io-client";

// const { io } = require("socket.io-client");

export const initSocket = async () =>{
    const options = {
        forceNew : true,
        reconnectionAttempts: 'Infinity',
        timeout: 15000,
        transports: ['websocket', 'polling'],  // Allow both 'websocket' and 'polling' transports
        pingTimeout: 60000,  // Increase timeout period for ping
        pingInterval: 25000
    };

    return io(process.env.REACT_APP_BACKEND_URL, options);
}