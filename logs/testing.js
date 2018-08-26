const Discord = require('discord.js');

const read = require('./storage.json')
const config = require ('./config.json')
const fs = require('fs')

exports.use = (client, message, member, args, ...others) => {
    if (!message.member.roles.find(r => r.name.toLowerCase() === 'staff')) {
        message.channel.send(new Discord.RichEmbed().setColor("RANDOM").setDescription('You are missing permission.'))
        return
    }
    const ch = message.guild.channels.find('name', `ticket-${args[0]}`) || message.guild.channels.find('name', `commission-${args[0]}`) || message.guild.channels.find('name', `completed-commission-${args[0]}`) || message.guild.channels.find('name', `ans-ticket-${args[0]}`)
    try {
        ch.overwritePermissions(message.member, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        })
        message.channel.send(new Discord.RichEmbed().setColor("RANDOM").setDescription(`Added you to ticket with ID#${args[0]}.`))
    } catch (err) {
        message.channel.send(new Discord.RichEmbed().setColor("RANDOM").setDescription('Invalid ID.'))
    }
    };
module.exports.help = {
  name:'join'
}