import http from "http";
import path from "path";
import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import { default as logger } from "morgan";
import { createStream } from "rotating-file-stream";
import { default as DBG } from "debug";

import __dirname from "./approotdir.js";
import {basicErrorHandler, handle404, normalizePort, onError, onListening} from "./utils/utils";


// Global variables
const debug = DBG('server:debug');
const dbgerror = DBG('server:error');

// Initialize the express app object
export const app = express();

// Setting api port
export const port = normalizePort(process.env.PORT || '3000')
app.set('port', port);

// Middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'common', {
    stream: process.env.REQUEST_LOG_FILE  || 'log.txt' ?
        createStream(process.env.REQUEST_LOG_FILE || 'log.txt', {
            size: '10M',
            interval: '1d',
            compress: 'gzip',
            path: path.join(__dirname, 'logs')
        })
        : process.stdout
}));

app.get('/', function (req, res) {
    res.status(200).json({ "message": "server is up and running" });
})


// Error Handling
app.use(handle404);
app.use(basicErrorHandler);

export const server = http.createServer(app);
server.listen(port);

// Server Event handling
server.on('request', (req, res) => {
    debug(`${new Date().toISOString()} request: ${req.method} ${req.url}`);
})

server.on('error', onError);
server.on('listening', onListening);
