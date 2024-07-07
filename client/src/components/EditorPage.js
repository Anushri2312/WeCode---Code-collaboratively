import React, {useEffect, useRef, useState} from 'react';
import Client from './Client';
import Editor from "./editor (2)";
import {initSocket} from "../Socket";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import {
    useLocation,
    Navigate,
    useParams,
  } from "react-router-dom";


function EditorPage() {
    const [clients, setClients] = useState([]);
    const codeRef = useRef(null);

    const navigate = useNavigate();
    const Location = useLocation();
    const {roomId} = useParams();

    // to call instance for socket created in socket.js
    const socketRef = useRef(null);

    // if the error is that we dont have username

    useEffect (() => {
        const init = async () => {
            socketRef.current = await initSocket();

            // types of error that might occur
            socketRef.current.on("connect_error", (err)=> handleErrors(err));
            socketRef.current.on("connect_failed", (err)=> handleErrors(err));
            
            const handleErrors = (err)=> {
                console.log(err);
                toast.error("Socket connection failed, Try again later!");
                navigate("/");
            };


            socketRef.current.emit('join',{
                roomId,
                username: Location.state?.username,
            });

            socketRef.current.on("joined",({clients, username, socketId }) => {
                if (username !== Location.state?.username){
                    toast.success(`${username} joined the room!`);
                }
                setClients(clients);
                socketRef.current.emit("sync-code",{
                    code: codeRef.current,
                    socketId,
                });
            });

            socketRef.current.on("disconnected",({socketId, username}) => {
                toast.success(`${username} left the chat`);
                setClients((prev) => {
                    return prev.filter((client) => client.socketId !== socketId);
                });
            });
        };
        init();

        return ()=>{
            socketRef.current && socketRef.current.disconnect();
            socketRef.current.off("joined");
            socketRef.current.off("disconnected");
        };
    }, []);

    if(!Location.state){
        return <Navigate to = "/"/>
    }

    const copyRoomId = async() =>{
        try{
        await navigator.clipboard.writeText(roomId);
        toast.success("RoomId is copied!");
        }catch(error){
            console.log(error);
            toast.error("unable to copy the error!");
        }
    };
   
    const leaveRoom = async() => {
        navigate("/");
    };

  return (
    <div className = "container-fluid vh-100">
    <div className="row h-100">
        <div className="col-md-2 bg-dark text-light d-flex flex-column h-100"
        style = {{boxShadow: "2px 0px 4px rgba(0,0,0,0.1)"}}>
            <img src="edit.jpeg" alt="logo" className = "img-fluid mx-auto" style = {{maxWidth : "150px",marginTop: "-43px"}} />
            <hr style = {{marginTop : "-3 rem"}}/>

            {/* Client list container */}
            <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
                <Client key = {client.socketId} username = {client.username}/>
            ))}
            </div>
            <hr />
            {/* Buttons */}

            <div className="mt-auto">
                <button className="btn btn-success" onClick = {copyRoomId}>Copy RoomId</button>
                <button className="btn btn-danger mt-2 mb-2 px-3 btn-block" onClick = {leaveRoom}>Leave Room</button>
            </div>
        </div>

   {/* editor panel */}
        <div className="col-md-10 text-light d-flex flex-column h-100">
            <Editor socketRef = {socketRef} 
            roomId = {roomId} 
            onCodeChange = {(code) => {
                codeRef.current = code;
            }} 
            />
        </div>
    </div>
    </div>
  );
}

export default EditorPage;
