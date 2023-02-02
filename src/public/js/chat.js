
// socket.io front-end
const socket = io();

const d = document;
const form_chat = d.querySelector('form');
const container_messages = d.querySelector('.messages_chat');
const message_bottom = d.querySelector('#message_bottom');
const ola = d.querySelector("[name='user_Y6OPWctf1fm6WaaHAAAL']")
console.log(ola);
//url queries 
let params = new URLSearchParams(location.search)//queries from url;
const user = params.get('user_name');
const room = params.get('option_room');

//function to add messages 
const add_message = (msj) => {
  const div = d.createElement('div');
  div.innerHTML=`
    <span>${msj.name}</span><span>${msj.day}</span>
    <p>${msj.message}</p><span>${msj.date}</span>
  `;
  message_bottom.insertAdjacentElement('beforebegin', div); //insert a element before the selected element
  //bottom scroll when a message is added
  container_messages.scrollTo({
    behavior: 'smooth',
    top: container_messages.scrollHeight
  })
}

//function to add Room name
const add_room_name = (room_name) => {
  const div = d.querySelector('#container_room_name');
  div.textContent = room_name;
}

//function to add users in the room
const add_user_in_room = (user) => {
  const section = d.querySelector('.rooms_users_chat');
  const p = d.createElement('p');
  // p.setAttribute('id', `user_${user.id}`);
  p.setAttribute('name', `user_${user.id}`);
  p.innerText=user.user;
  section.appendChild(p);
}

//function to remove user from the room
const remove_user_in_room = () => {
  
}

//function to add saves messages
const add_saved_messages = (messages) => {
  messages.forEach(message => {
    add_message(message);
  });
}

//event ContentLoad that run functions
d.addEventListener('DOMContentLoaded', ()=>{
  add_room_name(room);
})

//event to add messages in the box
form_chat.addEventListener('submit', (e)=>{
  e.preventDefault()
  const mensaje = d.querySelector('input').value;
  const msj = { user, room, mensaje }
  //socket to tell the server you wrote
  socket.emit('info_user_chat', msj);

  d.querySelector('input').value='';
  d.querySelector('input').focus();
})

//socket about tell server that you are in a room for messages and show you're there
socket.emit('info_room_show_user', {room, user});

//socket about information of saved messages
socket.on('info_saved_messages', (msj) => {
  add_saved_messages(msj);
})

//socket about information of new message
socket.on('info_chat_message', (msj) => {
  add_message(msj);
})

// socket to tell users i'm in a room 
socket.on('info_users_ur_in_room', (user) => {
  add_user_in_room(user);
})

//NEED TO REMAIN CURRENTLY USERS IN CHAT, DONT FORGET IT ...........

//socket to tell users i'm no longer in a room
// socket.on('info_users_ur_no_room', (id) => {
//   console.log('Te fuiste: '+id);
//   const menu = d.querySelector(`.rooms_users_chat`);
//   const user = menu.querySelector(`[name='user_${id}']`)
//   user.forEach(function(el) {
//     // Do stuff here
//     console.log(el.tagName);
// });
//   console.log(menu);
//   console.log(user);
// })