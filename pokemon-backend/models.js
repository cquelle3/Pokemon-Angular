const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
    name: String,
    isShiny: Boolean
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = { 
    Pokemon
};