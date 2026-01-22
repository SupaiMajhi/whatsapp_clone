import { rateLimit } from "express-rate-limit";


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: "You have reached your limit, try again after an hour.",
    legacyHeaders: false,
    standardHeaders: true,
});


export default authLimiter;