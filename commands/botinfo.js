const discord = require('discord.js');
const config = require('../config.json')

exports.run = (inv, message, params) => {
    message.react("✅")
    var botinfo = new discord.RichEmbed()
        .setTitle(`Vell Pro`)
        .setAuthor(`Author: Alphi#9839`, "https://cdn.discordapp.com/avatars/368592012116623362/3d1b0bf15c53f0d29c57430588bd4cdb.jpg?size=1024")
        .setColor(config.embedcolor)
        .setTimestamp()
        .setFooter('Developed by Alphi', inv.user.displayAvatarURL)
        .setDescription(`Pro version of the Discord.js bot *Vell*`)
        .addField(`Currently serving:`, `${inv.users.size} users!`)
    message.channel.send(botinfo);
};


exports.conf = {
    name: 'botinfo',
    aliases: [`botinformation`],
    permLevel: 4,
    enabled: true,
    guildOnly: true
};
