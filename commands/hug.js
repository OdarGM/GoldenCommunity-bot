const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json")
exports.run = (inv, message, args) => {
   const rando_imgs = [
'https://media.giphy.com/media/CZpro4AZHs436/giphy.gif',
'https://media.giphy.com/media/CZpro4AZHs436/giphy2.gif',
'https://media.giphy.com/media/CZpro4AZHs436/giphy3.gif',
]
 const mention = message.mentions.members.first();
 const hug = new Discord.RichEmbed()
 .setTimestamp()
 .setColor("#ff0000")
 .setImage(rando_imgs[Math.floor(Math.random() * rando_imgs.length)])
 .setFooter("Sent by: " + message.author.username)
 message.channel.send(mention + " you have been hugged by: " + message.author.username + " :heart:")
 message.channel.send(hug)
 mention.send("You were hugged by: " + message.author.username + " in " + `${message.guild.name}`)

}
