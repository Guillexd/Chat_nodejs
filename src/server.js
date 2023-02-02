import express from "express";
import { add_chat, absolute_path, search_db } from "./util.js";
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
  const id = socket.id;
  console.log(`user ${ id } connected`);
  
  //socket to hear the server that you are in a room for messages
  socket.on('info_room_show_user', async({room, user})=>{
    const db = await search_db(absolute_path(`/chat/${room}.json`));
    //socket to send saved messages
    socket.emit('info_saved_messages', db);
    //socket to tell users you're in a room
    socketServer.emit('info_users_ur_in_room', {user, id});
  })

  //socket to hear the server you wrote
  socket.on('info_user_chat', async (msj) => {
    const info_msj = await add_chat(absolute_path(`/chat/${msj.room}.json`), msj)
    socketServer.emit('info_chat_message', info_msj);
  })

  //user disconnected
  socket.on('disconnect', () => {
    console.log(`user ${id} disconnected`)});
    //socket to tell users you're no longer in a room
    socketServer.emit('info_users_ur_no_room', id);
})
