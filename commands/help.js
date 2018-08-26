const Discord = require('discord.js');
const package = require('../package.json')
const config = require('../config.json')

exports.run = (inv, message, args) => {
    let embed = new Discord.RichEmbed()
            .addField('Vell\'s Commands', 'Help Menu')
            .addField('Google <:google:473173054252384258>', 'Googles what you ask for.')
            .addField('Dict 📔', 'Defines what you search for.')
            .addField('Status <a:loading:465944291634839554>', 'displays the server status for AQ3D game.')
            .addField('Admin Commands 📵', 'Mute - Ban - Kick - Prune')
            .addField('Servers <:discord:474741073546051612>', 'Displays amount of servers the bot is in.')
            .addField('Users 👥', 'Displays amount of users for bot.')
            .addField("Music 🎵", "Usage: ?mhelp")
            .addField("Info ℹ", "DMs bot's info (BETA)")
            .addField("Troll Command 🎉", "?bann, sends a fake message of tagged user being banned")
            .addField("8ball 🎱", "Asks a question to 8ball, usage: ?8ball am I cool?")
            .setColor(`0x550055`)
            .addField("Kill ☠", "Sends death embed!")
            .addField("Rageshoot <a:rage:473165545429270529>", "Sends animated shooting pepe")
            .addField("Server Info <:discord:474741073546051612>", "?serverinfo")
            .addField("Kiss 😘", "Sends an image, a text message and a DM to the mentioned user!")
            .addField("Hug 🤗", "Sends an image, a text message and a DM to the mentioned user!")
            .addField("Memory 🖥", "?memory, displays the bot's memory usage")
            .addField("Weather 🌦", "?weather location, displays selected location's weather")
            .addField("Translate 📑", "?translate 'language' 'text', without the 's")
            .addField("Love ❤", "?love @user1 @user2, returns love connection between users")
            .addField("Sex With 🔞", "?sexwith @user (NSFW command)")
            .addField("Economy Commands", "?daily ~ ?bal ~ ?send @user")
            .addField("Features 🔜", "More features are being added!!")
            .setThumbnail(message.author.avatarURL)
            .setFooter("Server: " + `${message.guild.name}`, message.guild.iconURL);
               message.author.send({ embed });
             let cembed = new Discord.RichEmbed()
              .addField("Please check your DM's 👌", "Help is on its way...")
              .setColor(`0x550055`)
              .setFooter("Server: " + `${message.guild.name}`, message.guild.iconURL);
            message.channel.send({ embed: cembed });
            let extra = new Discord.RichEmbed()
            .addField("For more info on commands, type ?commands", "<:staff:474743393658863626>")
 
  }
