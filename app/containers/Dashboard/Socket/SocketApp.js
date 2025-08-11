import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import socketIOClient from "socket.io-client";
import SocketContext from "./SocketContext";
import Application from '/app/containers/App/Application';

const WEBURL = 'https://liveapiprovider.com:3003';
const WEBURLSports = 'https://webcaresol.org:4002';

let socket;
let socketSports;

const SocketApp = ({ history }) => {
    console.log("I AM CALLED");
    const dispatch = useDispatch();
    const [isSocketConnected, setSocketConnected] = useState(false);

    // Prevent double initialization in Strict Mode
    const hasConnected = useRef(false);

    useEffect(() => {
        if (hasConnected.current) return;
        hasConnected.current = true;

        
        console.log("I AM CALLED 3");

        // --- Main Socket ---
        socket = socketIOClient(WEBURL, { transports: ['websocket'],reconnection:true });
        setSocketConnected(true);

        socket.on('Error' , () => {
            console.log("I am CALLED 4");
        });
        socket.on("invalidSession", () => {
            console.log("I am CALLED 5");
        });
        socket.on("connect", () => {
            console.log("I am CALLED 2");
        });
        socket.on("disconnect", () => {
            console.log("I am CALLED 6");
        });

        // --- Sports Socket ---
        socketSports = socketIOClient(WEBURLSports, { transports: ['websocket'],reconnection:true });
        setSocketConnected(true);

        socketSports.on('Error', errorDisplay);
        socketSports.on("invalidSession", invalidSessionFun);
        socketSports.on("disconnect", disconnectFunctionS);
        socketSports.on("connect", connectFunctionS);

        socket.emit("addMarketWatch", {
            "product" : "NIFTY-I"
        });


        // Cleanup sockets when unmounting
        return () => {
            console.log("Cleaning up sockets...");
            if (socket) {
                socket.off('Error', errorDisplay);
                socket.off("invalidSession", invalidSessionFun);
                socket.off("disconnect", disconnectFunction);
                socket.off("connect");
                socket.disconnect();
            }
            if (socketSports) {
                socketSports.off('Error', errorDisplay);
                socketSports.off("invalidSession", invalidSessionFun);
                socketSports.off("disconnect", disconnectFunctionS);
                socketSports.off("connect", connectFunctionS);
                socketSports.disconnect();
            }
        };
    }, []);

    const connectFunctionS = () => {
        console.log("connected to sports socket");
    };

    const connectFunction = () => {
        console.log("connected to socket");
    };

    const disconnectFunctionS = () => {
        console.log("disconnected sport");
    };

    const disconnectFunction = () => {
        console.log("disconnected");
    };

    const errorDisplay = (data) => {
        console.log("!!!!!!!!! data printed here", data);
    };

    const invalidSessionFun = async (data) => {
        console.log("!!!!!!!!!!!!!!!!!!! Invalid Session");
    };

    const sockets = { socket, socketSports };

    return (
        <div>
            {isSocketConnected ? (
                <SocketContext.Provider value={sockets}>
                    <Application history={history} />
                </SocketContext.Provider>
            ) : (
                <div>Socket not connected</div>
            )}
        </div>
    );
};

export default SocketApp;
