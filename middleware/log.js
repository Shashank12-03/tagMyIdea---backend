import { logger } from "../logs/logger.js";

export function logRequests(req,res,next) {
    logger.info({
        message:'Api call',
        method:req.method,
        url:req.originalUrl,
        ip:req.ip,
        timeStamp: new Date().toISOString()
    });
    next();
}

export function errorLogRequests(err, req, res, next){
    logger.error({
        message: 'API Error',
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        timestamp: new Date().toISOString(),
    });
    res.status(err.status || 500).json({ message: 'Internal Server Error' });
    next();
}