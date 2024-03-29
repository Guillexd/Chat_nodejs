import express from "express";
import charRouter from './routes/chat.router.js'
import { add_chat, absolute_path, search_db, add_user_info, search_user_db, remove_user_info, add_chat_doc } from "./util.js";
import { Server } from "socket.io";

const server = express();
// server.use(cors());  //cors() as middleware 

//default settings
server.use(express.json());
server.use(express.urlencoded({extended:true}));
//publid folder(static)
server.use(express.static(absolute_path('/public')))

//routing
server.use('/chat', charRouter);

//http
const PORT = 8080 || process.env.PORT;
const hostname = '192.168.0.12';
const httpServer = server.listen(PORT, hostname, ()=> console.log(`Listening trought port: ${PORT}`));

//socket.io back-end
const socketServer = new Server(httpServer);

socketServer.on('connection', async(socket) =>{
  //user connected
  const id = socket.id;
  console.log(`user ${ id } connected`);
  
  //socket to hear the server that you are in a room for messages
  socket.on('info_room_show_user', async({room, user})=>{

    //ROOM
    socket.join(room);
    const db = await search_db(absolute_path(`/chat/${room}.json`));
    //socket to send saved messages
    socket.emit('info_saved_messages', db);
    //socket that make bot tell users you're in a room
    socket.broadcast.to(room).emit('bot_greetings', user)
    //socket to hear the server you wrote
    socket.on('info_user_chat', async (mensaje) => {
      const msj = { user, mensaje }
      const info_msj = await add_chat(absolute_path(`/chat/${room}.json`), msj)
      socketServer.to(room).emit('info_chat_message', info_msj);
    })
    socket.on('file_was_sent', async(doc_name)=>{
      const doc = await add_chat_doc(absolute_path(`/chat/${room}.json`), user, doc_name);
      socketServer.to(room).emit('show_files', doc);
    })
  })
  //USERS
  const path = '/chat/users.json';
  const db_user = await search_user_db(absolute_path(path));
  //socket to send saved users
  socket.emit('info_saved_users', db_user);
  //socket to tell users you're in a room
  socket.on('info_users_ur_in_room', async (userObj)=>{
  const new_user = await add_user_info(id, userObj.user, userObj.room, absolute_path('/chat/users.json'));
  socketServer.emit('info_new_user', new_user)
  })
  //user disconnected
  socket.on('disconnect', async() => {
    console.log(`user ${id} disconnected`)
    //socket to tell users you're no longer in a room
    const user = await remove_user_info(absolute_path(path), socket.id);
    if(user){
      socket.broadcast.to(user[0].room).emit('info_users_ur_no_room', user);
    }
  });
})
