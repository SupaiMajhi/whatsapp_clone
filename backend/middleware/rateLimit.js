import { rateLimit } from "express-rate-limit";


const authLimiter = rateLimit({
    windowMs: 1000 * 60 * 60 * 2,
    limit: 3,
    message: "You have reached your limit, try again after an hour.",
    legacyHeaders: false,
    standardHeaders: true,
});


export default authLimiter;