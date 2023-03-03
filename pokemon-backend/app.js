const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.get('/hello', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send("<h1>Hello Express.js user!</h1>");
});

const start = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        app.listen(PORT, () => console.log("Server started on port " + PORT));
    } 
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

start();