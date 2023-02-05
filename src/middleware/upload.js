import multer from "multer";
import { absolute_path } from "../util.js";

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, absolute_path('/public/uploads'));
        },
        filename: (req, file, cb) => {
            const room = req.headers.referer.split("option_room=")[1];
            cb(null, `${room}-${Date.now()}-${file.originalname}`);
        }
    })
})

export default upload;