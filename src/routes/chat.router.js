import { Router } from "express";
import { absolute_path } from "../util.js";
import upload from "../middleware/upload.js";

const router = Router();

//router
router.get('/', (req, res)=>{
  res.status(200).sendFile(absolute_path('/public/pages/chat.html'));
})

router.post('/', upload.array('file', 10), (req, res)=>{
  res.json({message: req.files});
})

export default router;