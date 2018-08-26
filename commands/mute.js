const Discord = require('discord.js');
const config = require('../config.json');
const package2 = require("../package.json");
const fs = require('fs');


exports.run = (inv, message, args) => {
        const ms = require("ms");
        let UserMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!UserMute) return message.channel.send("Please tag user to mute!");
        if (!message.guild.me.permissions.has("MANAGE_GUILD")) return message.reply("I cant do that")
        if (UserMute.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry, you don't have permissions to use this!");
        if (UserMute.id === message.author.id) return message.channel.send("You cannot mute yourself!");
        let MutedRol = message.guild.roles.find(`name`, "Muted");
        if (!MutedRol) {
            try {
                MutedRol =  message.guild.createRole({
                    name: "Muted",
                    color: "#000000",
                    permissions: []
                })
                message.guild.channels.forEach(async (channel, id) => {
                     channel.overwritePermissions(MutedRol, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        let MuteTime = args[1]
        if (!MuteTime) return message.channel.send("For how long do you want to mute?");
         (UserMute.addRole(MutedRol.id));
        message.reply(`<@${UserMute.id}> has been muted for ${ms(ms(MuteTime))}`);
        setTimeout(function () {
            UserMute.removeRole(MutedRol.id);
            message.channel.send(`<@${UserMute.id}> has been unmuted!`);
        }, ms(MuteTime)); //test

        message.delete();
    }

