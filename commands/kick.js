const Discord = require('discord.js');

const package = require("../package.json")
const fs = require('fs');


exports.run = (inv, message, args) => {
        if (!message.member.hasPermission("KICK_MEMBERS"))
            return message.channel.send("Sorry, you don't have permissions to use this!");
        let tokick = message.mentions.members.first();
        if (!tokick) return message.channel.send("Kick Who?")
        if (tokick.id === "291221132256870400")
            return message.channel.send("No")
        if (!tokick.kickable)
            return message.channel.send("I cannot kick this user!");
        let reason = args.slice(1).join(' ');
        if (!reason) {
            reason = "No reason given";
        } else {
            reason = `${reason}`
        }
         tokick.kick(reason)
            .catch(error => message.reply(`Sorry, I couldn't kick because of : ${error}`));
        message.channel.send(`${tokick} has been **kicked** from the server for: ${reason}`)
        message.delete();
 }
