import React, {useState} from 'react';
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import { v4 as uuid} from "uuid";


function Home() {
    const[roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const genRoomId = (e) =>{
      e.preventDefault();
      const Id = uuid();
      setRoomId(Id);
      toast.success("Room id is generated");
    };

    const navigate = useNavigate();

    const joinRoom = () =>{
        if(!roomId || !username) {
            toast.error("Both the input fields are required");
            return;
        }
        // redirect
        navigate(`/editor/${roomId}`, {
            state: {
                // username ki value leke ja rhe
                username,
            },
        })
        toast.success("room is created!");
    }

    const handleInputEnter = (e) =>{
        if(e.code === "Enter"){
            joinRoom();
        }
    }

    return (
        < div className="container-fluid">
           < div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-12 col-md-6">
              <div className="d-flex justify-content-center align-items-center ml-5 m" style={{ height: '70vh', width: '70vw', padding: '0', margin: '-150px' }}>
              <div className="card justify-content-center bg-purple" style={{  height: '70%', width: '70%', maxHeight: '900px', maxWidth: '1000px' , borderRadius: '1px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)', margin: 'auto'}}>
              <div className="card-body d-flex align-items-center justify-content-center bg-white" style={{ height: '100%' }}>
      <div className="row w-100">
        {/* Left side: Logo */}
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <img
            src="c2.png"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "100%", width: "250px",border: '2px solid white' }} /* Adjust the width to make the logo larger */
          />
        </div>
    
          {/* Divider */}
          <div className="col-md-1 d-flex align-items-center">
          <div style={{ borderLeft: '2px solid black', height: '100%', margin: 'auto' }}></div>
        </div>
    
        {/* Right side: Form inputs and buttons */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h9 className="card-title text-black text-center mb-4" style = {{font: 'cursive'}}>Get started to collaborate!!</h9>
          <div className="form-group">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="form-control mb-2"
              placeholder="ROOM ID"
              onKeyUp={handleInputEnter}
              style={{ border: '2px solid black' }}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control mb-2"
              placeholder="USERNAME"
              onKeyUp={handleInputEnter}
              style={{ border: '2px solid black' }}
            />
          </div>
          <button
            onClick={joinRoom}
            className="btn btn-success btn-lg btn-block"
            style={{ border: '2px solid white' }}
          >
            JOIN
          </button>
          <p className="mt-3 text-black text-center">
            Don't have a room ID? Create{" "}
            <span
              onClick={genRoomId}
              className="text-success"
              style={{ cursor: "pointer", color: "black"  }}
            >
              New Room
            </span>
          </p>
        </div>
      </div>
      </div>
      </div>
      </div>
     </div>
     </div>
     </div>
      );
}

export default Home
