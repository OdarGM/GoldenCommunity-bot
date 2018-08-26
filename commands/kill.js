const Discord = require('discord.js');
exports.run = (inv, message, args) => {
 message.react("💀")
 message.react("☠")
 let mentions = message.mentions.users;
 const kill = new Discord.RichEmbed()
 .setTitle("Death Request", message.author.username)
 .setDescription("Please repeat in loud voice this magic spell: ik er men i deet on die")
 .setColor(`#9400d3`)
 .setImage("data:image/png;base64,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")
 .setTimestamp()
 .setFooter(message.author.username + " is waiting for death!")
 message.channel.send(kill)
 const killed = new Discord.RichEmbed()
 .setTitle("Dead Request", message.author.username)
 .setDescription("You have succesfully died! Rest in peace! (or not :3)")
 .setColor(`#9400d3`)
 .setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQae8KRb-Kv9hCFA5_ZusrZEKOXw7DqelmBr8MeoANG5yOYP-x26Q")
 .setTimestamp()
 .setFooter(message.author.username + " died at:")
 message.channel.send(killed)
 const directdeath = new Discord.RichEmbed()
 .setTitle("You have died HAHAHAHA", message.author.username)
 .setColor(`0x00ff00`)
 .setThumbnail(message.author.avatarURL)
 message.author.send(directdeath)
}