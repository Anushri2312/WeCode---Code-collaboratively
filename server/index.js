const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
// const ACTIONS = require("./Actions");

const server = http.createServer(app);

// const io = new Server(server);
const io = new Server(server, {
    maxHttpBufferSize: 1e7,   // Increase buffer size if needed
    pingTimeout: 10000,       // Increase timeout period for ping
    pingInterval: 25000,      // Increase interval for ping
    transports: ['websocket'] // Specify only 'websocket' transport
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  // console.log('Socket connected', socket.id);
  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // notify that new user join
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // sync the code
  socket.on("code-change", ({ roomId, code }) => {
    socket.in(roomId).emit("code-change", { code });
  });
  // when new user join the room all the code which are there are also shows on that persons editor
  socket.on("sync-code", ({ socketId, code }) => {
    io.to(socketId).emit("code-change", { code });
  });

  // leave room
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    // leave all the room
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));





























// const express  = require("express");
// const http = require("http");
// const {Server} = require("socket.io");

// const app = express();

// // passing the app instance in http.createServer means app will handle all incoming http requests in server
// const server = http.createServer(app);
// // humne socket io mein http ka server daal diya hai
// const io = new Server(server);
// const userSocketMap = {};

// const getAllConnectedClients = (roomId) => {
//         return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//             (socketId) =>
//             {return {
//                socketId,
//                username : userSocketMap[socketId],
//             };
//         }
//         );
// };


// // This will work when called upon from the client side as this is a connection between client and server from client to server
// io.on("connection", (socket) => {
//     // console.log(`User Connected: ${socket.id}`);

//     // to listen to data coming from backend and sabki list ko socketmap mein add krne ke liye 
//     socket.on("join", ({roomId, username}) => {
//            userSocketMap[socket.id] = username;

//            // isse socket agar pre-existing roomId h so usmein user ko add krenge else ek naya room bana denge
//            socket.join(roomId);

//            // to pass an alert ki log join ho rhe in the room
//            const clients = getAllConnectedClients(roomId);

//            // to notify clients added to room Id also in ui of editorpage
//            clients.forEach(({socketId}) => {
//                 io.to(socketId).emit("joined", {
//                 clients,
//                 username,
//                 socketId : socket.id,
//                 });
//            });
//     });

//     socket.on("disconnecting", () => {
//         const rooms = [...socket.rooms];

//         //leave all the room
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit("disconnected", {
//                  socketId : socket.id,
//                  username : userSocketMap[socket.id],
//             });
//         });
        
//         delete userSocketMap[socket.id];
//         socket.leave();

//     });
// });

// // It attempts to get the port number from the PORT environment variable. If PORT is defined, its value will be used.
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log("server is running on " + PORT +" port!");
// })

