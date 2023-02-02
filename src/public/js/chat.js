
// socket.io front-end
const socket = io();

const d = document;
const form_chat = d.querySelector('form');
const container_messages = d.querySelector('.messages_chat');

//function to add messages 
const add_message = (msj) => {
  const div = d.createElement('div');
  div.innerHTML=`
    <span>${msj.name}</span><span>${msj.date}</span>
    <p>${msj.message}</p>
  `;
  container_messages.appendChild(div);
}

//url queries 
let params = new URLSearchParams(location.search)//queries from url;
const user = params.get('user_name');
const room = params.get('option_room');

form_chat.addEventListener('submit', (e)=>{
  e.preventDefault()
  const mensaje = d.querySelector('input').value;
  const msj = { user, room, mensaje }
  socket.emit('info_user', msj);
  d.querySelector('input').value='';
  d.querySelector('input').focus();
})

//info new message
socket.on('info_chat_message', (msj)=>{
  add_message(msj);
})
