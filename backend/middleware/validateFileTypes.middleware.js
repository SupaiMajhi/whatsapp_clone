import { fileTypeFromFile } from "file-type";

const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
];

const validateFileType = async (req, res, next) => {
    try { 
    const data = await fileTypeFromFile(req.file.path);
    let allowed = allowedTypes.includes(data.mime);
    if (!allowed) {
      return next(new Error("File format is not allowed."));
    }
    next();   
    } catch (error) {
        next(error);
    }
}

export default validateFileType;