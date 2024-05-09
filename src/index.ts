import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { chooseQuestion } from "./utils/chooseQuestion";


const app = express();

const cors = require('cors')

const httpServer = createServer()

// httpServer.use(cors);


const io = new Server(
    httpServer,
    {
        cors: {
            origin: '*'
        }
    }
)

let playerList: string[] = []

io.on("connection", (socket) => {
    console.log('client connected from:')
    console.log(socket.id)
    playerList.push(socket.id)
    socket.emit('successful-connection', 'You connected successfully!')
    io.emit('player-list', playerList)
    let question = chooseQuestion()

    socket.on('gameStarted', 
        ()=>{
            console.log('GAME STARTED');
            io.emit('gameStarted');
  
            console.log(question);
            io.emit('firstQuestion', question);
        }
    )

    socket.on("disconnect", () => {
        playerList = playerList.filter(
            (id) => id !== socket.id
        )
        io.emit('player-list', playerList)
        console.log(socket.id + " disconnected")
    })
})



httpServer.listen(3000, ()=>{
    console.log('Running on 3000'); 
})