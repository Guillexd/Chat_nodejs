import express from "express";
import { add_chat, absolute_path } from "./util.js";
import { Server } from "socket.io";

const server = express();

//default settings
server.use(express.json());
server.use(express.urlencoded({extended:true}));
//publid folder(static)
server.use(express.static(absolute_path('/public')))

//router
server.get('/chat', (req, res)=>{
  res.status(200).sendFile(absolute_path('/public/pages/chat.html'));
})

//http
const PORT = 8080 || process.env.PORT;
const hostname = '192.168.0.38';
const httpServer = server.listen(PORT, hostname, ()=> console.log(`Listening trought port: ${PORT}`));

//socket.io back-end
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) =>{
  //user connected
  console.log(`user ${socket.id} connected`);

  //user information
  socket.on('info_user', async (msj) => {
    const info_msj = await add_chat(absolute_path(`/chat/${msj.room}.json`), msj)
    socketServer.emit('info_chat_message', info_msj);
  })

  //user disconnected
  socket.on('disconnect', () => console.log(`user ${socket.id} disconnected`));
})
