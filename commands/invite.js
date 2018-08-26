
const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json")

exports.run = (inv, message, args) => {
    message.channel.send("https://discordapp.com/oauth2/authorize/?permissions=1610079425&scope=bot&client_id=368592012116623362")

}
