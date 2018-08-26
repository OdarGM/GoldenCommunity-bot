const Vell = require('discord.js');
exports.run = (inv, message, args) => {
message.react("✅")
const credits = new Vell.RichEmbed()
.setTitle("Vell Bot Development Credits", message.author.avatarURL)
.setDescription("Current developers for the Discord Bot, Vell.")
.addField("Alphi", "#9839")
.addField("Odar", "#6745")
.setTimestamp()
.setFooter("Requested by: " + message.author.username)
.setColor(0x00ff00)
message.channel.send(credits)
}
