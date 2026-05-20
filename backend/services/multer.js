import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";

if(!existsSync("./tmp/uploads")){
    mkdirSync("./tmp/uploads");
} 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve("./tmp/uploads"))
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
})

const upload = multer({ storage });

export default upload;