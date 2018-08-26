const Discord = require('discord.js');
exports.run = (inv, message, args) => {
   const music = new Discord.RichEmbed()
   .setAuthor("Developer: Alphi", message.author.avatarURL)
   .setTimestamp()
   .setDescription("Help Menu for music commands! :musical_note:")
   .setThumbnail(inv.user.avatarURL)
   .addField("Play", "?play 'song name'/'yt link'")
   .addField("Pause", "?pause")
   .addField("Resume", "?resume")
   .addField("Queue", "?queue")
   .addField("Search", "?search 'song name'")
   .addField("Stop", "?stop")
   .addField("Stats", "?stats")
   .setColor(`0x005500`)
   .setFooter("Requested by: " + message.author.username)
   message.author.send(music)
   const channel = new Discord.RichEmbed()
   .setTitle("Help is on its way! :ok_hand:", inv.user.avatarURL)
   .setTimestamp()
   .setColor(`0x005500`)
   .setFooter("Requested by: " + message.author.username)
   message.channel.send(channel);
   }
