import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { chooseQuestion } from "./utils/chooseQuestion";
import { Question } from "./model/question";


const httpServer = createServer()



const io = new Server(
    httpServer,
    {
        cors: {
            origin: '*'
        }
    }
)

let playerList: any[] = []
let answersList: any[] = []
let question: Question | null = null;

let addDefaultAnswers = () => {
    answersList.push({
        answer: question!.answer,
        origin: 'correctAnswer'
    });
    if(question!.fakeAnswer) answersList.push({
        answer: question!.fakeAnswer,
        origin: 'fakeAnswer'
    });  
}


io.on("connection", (socket) => {
    console.log('client connected from:')
    console.log(socket.id)
    
    socket.on('playerName', (playerName) => {
        let player = {
            id: socket.id,
            nickname: playerName
        }
        playerList.push(player)
        socket.emit('successful-connection', 'You connected successfully!')
        io.emit('player-list', playerList)  
    })
    if(answersList.length === 0){
        question = chooseQuestion();
        addDefaultAnswers()
    }

    console.log(answersList)
    socket.on('gameStarted', 
        ()=>{
            console.log('GAME STARTED');
            io.emit('gameStarted');
  
            console.log(question);
            io.emit('firstQuestion', question);            
        }
    )

    socket.on('firstAnswer', (playerAnswer)=>{
        console.log(playerAnswer)
        answersList.push({
            answer: playerAnswer.answer,
            origin: playerAnswer.nickname
        })

    })

    socket.on('secondPhase', () => {
        console.log('second Phase')
        console.log(answersList)
        io.emit('answers', answersList)
    })
    


    socket.on("disconnect", () => {
        playerList = playerList.filter(
            (player) => player.id !== socket.id
        )
        io.emit('player-list', playerList)
        console.log(socket.id + " disconnected")
        if(playerList.length ===0){
            answersList = []
        }
        console.log(answersList)
    })
})



httpServer.listen(3000, ()=>{
    console.log('Running on 3000'); 
})