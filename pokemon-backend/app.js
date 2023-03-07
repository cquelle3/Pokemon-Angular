const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const models = require("./models");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200);
    res.send({info: 'Welcome to root URL of Server'});
});

app.get('/caughtPokemon', async (req, res) => {
    const result = await models.Pokemon.find({});
    res.status(200);
    res.send(result);
});

app.post('/caughtPokemon', async (req, res) => {
    const poke = new models.Pokemon(req.body);
    poke.save().then(
        () => {
            console.log("One entry added");
            res.status(200);
            res.send({info: 'Added ' + req.name + ' to pokemon storage'});
        },
        (err) => console.log(err)
    );
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