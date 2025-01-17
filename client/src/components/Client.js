import React from 'react';
import Avatar from "react-avatar";

function Client({username}) {
  return (
    <div className = "d-flex align-items-center mb-3">
      <Avatar name = {username.toString()} size={75} round = "20px" className="mr-3"></Avatar>
      <span className="mx-2">{username.toString()}</span>
    </div>
  );
}

export default Client;
