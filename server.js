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

import api from "./routes/api.js";
import routes from "./routes/index.js";


// Global variables
const debug = DBG('server:debug');
const dbgerror = DBG('server:error');

// Initialize the express app object
export const app = express();

// Setting api port
export const port = normalizePort(process.env.PORT || '3000')
app.set('port', port);

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hjs")

// Middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
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

// API ROUTES
app.use('/', routes)
app.use('/api', api)

app.get('/', function (req, res) {
    res.status(200).json({ "message": "server is up and running" });
})

// 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

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
