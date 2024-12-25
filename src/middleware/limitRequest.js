import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100,  // Tối đa 100 request trong 15 phút
    message: {
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true, // Trả về thông tin rate limit trong headers
    legacyHeaders: false   // Tắt X-RateLimit-* headers
});
