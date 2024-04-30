import express from "express";


const app = express();

app.get('/', (req, res) => {
    res.send('Running server')
})

app.listen(4321, ()=>{
    console.log('Running on 4321');
    
})