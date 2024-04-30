import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";


const app = express();

const cors = require('cors')

const httpServer = createServer()

// httpServer.use(cors);


const socket = new Server(
    httpServer,
    {
        cors: {
            origin: '*'
        }
    }
)

socket.on("connection", (socket) => {
    console.log('client connected from:')
    console.log(socket.id)
    socket.emit('successful-connection', 'You connected successfully!')
})

httpServer.listen(3000, ()=>{
    console.log('Running on 3000'); 
})