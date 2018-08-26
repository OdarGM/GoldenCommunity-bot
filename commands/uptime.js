const Discord = require('discord.js');
exports.run = (inv, message, args) => {
    const uptime = new Discord.RichEmbed()
    .setAuthor("Vell's Uptime", inv.user.avatarURL)
    .setDescription("Uptime of Vell Bot")
    .addField("Hours",Math.round(inv.uptime / (1000 * 60 * 60)), true )
    .addField("Minutes", Math.round(inv.uptime / (1000 * 60)) % 60, true)
    .setFooter(`Vell is currently serving ${inv.users.size} users!`, message.author.avatarURL)
     message.channel.send(uptime)
    }
