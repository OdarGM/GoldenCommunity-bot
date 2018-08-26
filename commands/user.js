const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json");
const database = require("sqlite3objs");
const userdb = new database("../userboard.db");

userdb.create("users", {
    id: "<key>",
    userID: "<string>",
    cash: "<int>",
    lastDaily: "<int>"
});

exports.run = (inv, message, args) => {
    //
};