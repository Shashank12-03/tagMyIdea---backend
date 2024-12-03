import winston from 'winston';
import path from "path";
import { fileURLToPath } from 'url';
import DailyRotateFile from 'winston-daily-rotate-file';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, 'logs');


export const logger = winston.createLogger({
        level:'info',
        format: winston.format.combine(winston.format.timestamp(),winston.format.json()),
        transports: [
            new DailyRotateFile({
                filename: `${logDirectory}/%DATE%-combined.log`,
                datePattern: 'YYYY-MM-DD',
                maxFiles: '14d', 
            }),
            new DailyRotateFile({
                filename: `${logDirectory}/%DATE%-error.log`,
                datePattern: 'YYYY-MM-DD',
                level: 'error',
                maxFiles: '14d',
            }),
        ],
        
    });


    if (process.env.NODE_ENV !== 'production') {
        logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
            ),
        })
        );
    }