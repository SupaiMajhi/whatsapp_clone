import { rateLimit } from "express-rate-limit";


const authLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 10,
    message: "You have reached your limit, try again after an hour.",
    legacyHeaders: false,
    standardHeaders: true,
});

export default authLimiter;