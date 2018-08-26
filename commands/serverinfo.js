const discord = require('discord.js');
const config = require('../config.json')

exports.run = (inv, message, params) => {
    function getFormattedTime(date) {
        var seconds = Math.floor(date.getSeconds());
        var minutes = Math.floor(date.getMinutes());
        var hours = Math.floor(date.getHours());
        var formattedTime;
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        if (minutes < 10 && hours >= 1) {
            minutes = `0${minutes}`;
        }
        formattedTime = (`${hours}:${minutes}:${seconds}`);

        return formattedTime;
    }

    var numberroles = message.guild.roles.map(role => role);
    var date = message.guild.createdAt;

    var ServerInformation = new discord.RichEmbed()
        .setAuthor("Author: Alphi", message.author.avatarURL)
        .setColor(config.embedcolor)
        .setTimestamp()
        .setThumbnail(message.guild.iconURL)
        .setDescription(`Server owner: ${message.guild.owner.user}\nServer owner ID: ${message.guild.ownerID}`)
        .addField(`Total members:`, message.guild.members.size, true)
        .addField(`Total roles:`, Array.from(numberroles).length, true)
        .addField(`Creation date:`, `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} | ${getFormattedTime(date)}`)
    message.channel.send(ServerInformation);
};

exports.conf = {
    name: 'serverinfo',
    aliases: ['srvinfo',],
    permLevel: 1,
    enabled: true,
    guildOnly: true
};
