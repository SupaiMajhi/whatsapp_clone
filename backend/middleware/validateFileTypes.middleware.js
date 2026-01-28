import { customResponse, determineFileType } from "../lib/lib.js";

const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
];

const validateFileType = async (req, res, next) => {
    try {
        if(req.file){
            const result = await determineFileType(req.file?.path);
            if(!result) return customResponse(res, 400, 'something went wrong.');
            if(!allowedTypes.includes(result)){
                return customResponse(res, 400, 'Unsupported file type.');
            }
        } 
        next();  
    } catch (error) {
        console.log('Error in validateFileType', error.message);
        return customResponse(res, 500, 'Internal server error.');
    }
}

export default validateFileType;