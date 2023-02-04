import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dayjs from 'dayjs';

const users_array = [];

//function dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

//function to generate Ids
const generate_id = async(path) => {
  const db = await search_db(path);
  const id = db.length===0 ? 1 : ++db.at(-1).id;
  return id;
}

//function search database
export const search_db = async(path) => {
  if(!fs.existsSync(path)) return [];
  let db = await fs.promises.readFile(path, 'utf-8');
  db = JSON.parse(db);
  return db;
}

//function to set an asbolute path
export const absolute_path = (dir) =>  join(__dirname, dir);

//function to search user database
export const search_user_db = async(path) => {
  if(!fs.existsSync(path)) return [];
  let db_user = await fs.promises.readFile(path, 'utf-8');
  db_user=JSON.parse(db_user);
  return db_user;
}

//function to add user in chat to a json
export const add_user_info = async(id, user, room, path) => {
  const user_obj = {
    id: id,
    user_name: user,
    room: room
  }
  const db_user = await search_user_db(path);
  db_user.push(user_obj);
  await fs.promises.writeFile(path, JSON.stringify(db_user));
  return user_obj;
}

//function to remove user in chat from a json
export const remove_user_info = async(path, id) => {
  const db_user = await search_user_db(path);
  const index = db_user.findIndex(user=>user.id == id);
  if(index==-1) return;
  const new_db_user = db_user.splice(index, 1);
  await fs.promises.writeFile(path, JSON.stringify(db_user));
  return new_db_user;

}

//function to add information about currently chat and put on a json
export const add_chat = async(path, msj) => {
  let now = dayjs()
  const chat_obj = {
    id: await generate_id(path),
    name: msj.user,
    message: msj.mensaje,
    day: now.format('dddd, H:mm a'),
    date: now.format('MMMM D, YYYY')
  }

  const db = await search_db(path);
  db.push(chat_obj);
  await fs.promises.writeFile(path, JSON.stringify(db));
  return chat_obj;
}