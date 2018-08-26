const Discord = require('discord.js');
let mention = message.mentions.members.first();
exports.run = async (inv, message, args) => {
   const ignored = new Discord.RichEmbed()
   .setAuthor("Ignoring " + mention.username)
   .setColor(`0x00ff00`)
   .setTimestamp()
   .setFooter("Requested by: " + message.author.username)
   message.author.send(ignored)
   let aclient = "${inv client}"
   }
   
