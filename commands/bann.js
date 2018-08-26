const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json")

exports.run = (inv, message, args) => {
   message.react("✅")
   const mention = message.mentions.members.first();
    message.channel.send(`${mention} **has been banned from the server!**`);
    message.channel.send(`${mention} **has left the server!**`);
    mention.send("**You have been banned from the server!**");
}
