import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isServerless = process.env.GAE_ENV === 'standard' || process.env.K_SERVICE;

const logDirectory = isServerless
    ? path.join('/tmp', 'logs') 
    : path.join(__dirname, 'logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const transports = [];

try {
    transports.push(
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
        })
    );
} catch (err) {
    console.error("Failed to initialize file logging:", err);
}

transports.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    })
);


export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports,
});
