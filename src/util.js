import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dayjs from 'dayjs';

//function dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

//function search database
export const search_db = async(path) => {
  if(!fs.existsSync(path)) return [];
  let db = await fs.promises.readFile(path, 'utf-8');
  db = JSON.parse(db);
  return db;
}

//function to generate Ids
const generate_id = async(path) => {
  const db = await search_db(path);
  const id = db.length===0 ? 1 : ++db.at(-1).id;
  return id;
}

//exporting...
//function to set an asbolute path
export const absolute_path = (dir) =>  join(__dirname, dir);
//function to add information about currently user and put on a json
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