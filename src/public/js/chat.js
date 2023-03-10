
// socket.io front-end
const socket = io();

const d = document;
const form_chat = d.querySelector('.send_chat');
const form_file = d.querySelector('#input_to_send');
const container_messages = d.querySelector('.messages_chat');
const files = d.querySelector('#form_files');
const message_bottom = d.querySelector('#message_bottom');

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
const add_user_in_room = (userObj) => {
  if(!(userObj.room === room)) return;
  const section = d.querySelector('.rooms_users_chat');
  const p = d.createElement('p');
  p.setAttribute('id', `user_${userObj.id}`);
  p.innerText=userObj.user_name;
  section.appendChild(p);
}

//function to add saves users
const add_users_in_room = (usersObj) => {
  usersObj.forEach(user => {
    add_user_in_room(user);
  })
}

//function to remove user from the room
const remove_user_in_room = (user) => {
  const menu = d.querySelector(`.rooms_users_chat`);
  const old_user = menu.querySelector(`#user_${user[0].id}`);
  menu.removeChild(old_user)
}

//function bot greetings
const bot_greetings = (user, type) => {
  const div = d.createElement('div');
  div.classList.add('bot_greetings');
  div.innerHTML=`
    <span>${user}</span>${type}
  `;
  message_bottom.insertAdjacentElement('beforebegin', div); //insert a element before the selected element
  //bottom scroll when a message is added
  container_messages.scrollTo({
    behavior: 'smooth',
    top: container_messages.scrollHeight
  })
}

//functions to show docs in chat
const show_docs = (doc_name) => {
  const ext = Array.from(doc_name.url).reverse().join("").split(".")[0].split("").reverse().join("");
  if(ext == 'pdf'){
    const div = d.createElement('div');
    div.innerHTML=`
    <span>${doc_name.name}</span><span>${doc_name.day}</span>
    <iframe src="/uploads/${doc_name.url}" frameborder="0"></iframe><span>${doc_name.date}</span>
    `;
    message_bottom.insertAdjacentElement('beforebegin', div); //insert a element before the selected element
    //bottom scroll when a message is added
    container_messages.scrollTo({
      behavior: 'smooth',
      top: container_messages.scrollHeight
    })
  } else if (ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
    const div = d.createElement('div');
    div.innerHTML=`
    <span>${doc_name.name}</span><span>${doc_name.day}</span>
    <img src="/uploads/${doc_name.url}" alt="${doc_name.url}"><span>${doc_name.date}</span>
    `;
    message_bottom.insertAdjacentElement('beforebegin', div); //insert a element before the selected element
    container_messages.scrollTo({
      behavior: 'smooth',
      top: container_messages.scrollHeight
    })
  } else if (ext == 'mp4'){
    const div = d.createElement('div');
    div.innerHTML=`
    <span>${doc_name.name}</span><span>${doc_name.day}</span>
    <video src="/uploads/${doc_name.url}" controls></video><span>${doc_name.date}</span>
    `;
    message_bottom.insertAdjacentElement('beforebegin', div); //insert a element before the selected element
    container_messages.scrollTo({
      behavior: 'smooth',
      top: container_messages.scrollHeight
    })
  }
}

//event ContentLoad that run functions
d.addEventListener('DOMContentLoaded', ()=>{
  add_room_name(room);
  d.addEventListener('click', (e)=>{
    const menu = d.querySelector('.rooms_users_chat');
    if(e.target.matches('#breakpoint_menu *') && window.innerWidth<763){
      menu.classList.toggle('breakpoint_menu');
    }
  })
})

//event to add messages in the box
form_chat.addEventListener('submit', (e)=>{
  e.preventDefault()
  const message = d.querySelector('input').value;
  //socket to tell the server you wrote
  socket.emit('info_user_chat', message);

  d.querySelector('input').value='';
  d.querySelector('input').focus();
})

//event to send images, videos and so on
files.addEventListener('change', (e) => {
  const files = e.target.files;
  //allow a not array use array methods (Array.from())
  Array.from(files).forEach(file=>{

    const formData = new FormData();
    formData.append("file", file);

    fetch("/chat", {
      method: "POST",
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      const doc_name = data.message[0].filename;
      socket.emit('file_was_sent', doc_name);
    });
  })
});

//socket about tell server that you are in a room for messages and show you're there
socket.emit('info_room_show_user', {room, user});

//socket about information of saved messages
socket.on('info_saved_messages', (msjs) => {
  msjs.forEach(msj=>{
    if(msj.message){
      add_message(msj);
    }
    if(msj.url){
      show_docs(msj)
    }
  })
})

//socket about information of new message
socket.on('info_chat_message', (msj) => {
  add_message(msj);
})

//socket about information of saved users in the room
socket.on('info_saved_users', (db_user) => {
  add_users_in_room(db_user);
})

// socket to tell users i'm in a room 
socket.emit('info_users_ur_in_room', {user, room});
socket.on('info_new_user', (new_user) => {
  add_user_in_room(new_user);
})

//bot tell everybody that i'm in the room
socket.on('bot_greetings', (user) => {
  bot_greetings(user, 'has join the chat')
})

//NEED TO REMAIN CURRENTLY USERS IN CHAT, DONT FORGET IT ...........

// socket to tell users i'm no longer in a room
socket.on('info_users_ur_no_room', (user) => {
  remove_user_in_room(user);
  bot_greetings(user[0].user_name, 'has left the chat');
})

//sochet to show docs that were sent
socket.on('show_files', (doc) => {
  show_docs(doc);
  console.log(doc);
})