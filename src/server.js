import express from "express";
import { __dirname, ola } from "./util.js";

const server = express();

//default settings
server.use(express.json());
server.use(express.urlencoded({extended:true}));
//publid folder(static)
server.use(express.static(__dirname+'/public'))
console.log(ola);
//http
const PORT = 8080 || process.env.PORT;
server.listen(PORT, ()=> console.log(`Listening trought port: ${PORT}`));