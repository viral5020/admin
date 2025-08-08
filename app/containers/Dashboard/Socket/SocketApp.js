import React, { useEffect, Component, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from "socket.io-client";
//import Application from 'app/containers/App/Application';
import Application from '../../../../app/containers/App/Application';
import SocketContext from "./SocketContext";

const WEBURL = 'https://webcaresol.org:4003';
const WEBURLSports = 'https://webcaresol.org:4002';

let socket = undefined;
let socketSports = undefined;

const SocketApp = ({children}) => {
    // const socket = socketIOClient(WEBURL);
    const dispatch = useDispatch();
    const [ isSocketConnected, changeSocketFlag ] = useState(false);

    useEffect(() => {
        socket = socketIOClient(WEBURL, {
            transports: ['websocket'],
            // reconnection: true,
        });
        changeSocketFlag(true);

        socket.on('Error', errorDisplay);
        socket.on("invalidSession", invalidSessionFun);
        socket.on("disconnect", disconnectFunction);
        socket.on("connect", connectFuntion);
        
        socketSports = socketIOClient(WEBURLSports, {
            transports: ['websocket'],
            // reconnection: true,
        });
        changeSocketFlag(true);

        socketSports.on('Error', errorDisplay);
        socketSports.on("invalidSession", invalidSessionFun);
        socketSports.on("disconnect", disconnectFunction);
        socketSports.on("connect", connectFuntion);

        //clean up while unmount
        return function cleanup () {
            socket.off('Error', errorDisplay);
            socket.off("invalidSession", invalidSessionFun);
            socket.off("disconnect", disconnectFunction);
            socket.off("connect", connectFuntion);
        };
    }, []);

    const connectFuntion = () => {
        console.log("conncted")
    }

    const disconnectFunction = () => {
        // window.location.reload();
        console.log("diconncted")
    }

    const errorDisplay = (data) => {
        console.log("!!!!!!!!!data prinetd here", data);
        // notification["error"]({
        //     message: 'Error',
        //     description: data && data.message ? data.message : "Something went wrong",
        // });
    };

    const invalidSessionFun = async (data) => {
        console.log("!!!!!!!!!!!!!!!!!!!Invalid Session");
        // await dispatch({
        //     type: 'USER_LOGOUT'
        // });
        // dispatch({
        //     type: 'SET_LOGIN_FLAG',
        //     flag: false
        // });
        // let url = /login;
        // var link = document.createElement("a");
        // link.setAttribute("href", url);
        // document.body.appendChild(link);
        // link.click();
        // notification["error"]({
        //     message: 'UnAuthorize',
        //     description: "Please Login Again",
        // });
    };

    const sockets = {
        socket,
        socketSports,
    }

    return (
        <div>
            {
                isSocketConnected ? (
                    <SocketContext.Provider value={sockets}>
                        <Application />
                    </SocketContext.Provider>
                ) : (
                    <Application shouldTimeoutSet={false} />
                )
            }
        </div>
    );
}

export default SocketApp;