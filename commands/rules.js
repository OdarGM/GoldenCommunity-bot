const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json")

exports.run = (inv, message, args) => {
   
   
   let emb = new Discord.RichEmbed()
   .setThumbnail(message.guild.iconURL)
   .setColor("#00ff00")
   .setTitle("Rules")
   .setDescription(`:one: **No need for personal attacks. If you have a problem with someone contact one of the peacekeepers, we will help you.**\n :two: **Spam of any kind will not be tolerated and may result in a server mute.**\n :three: **__No__ NSFW content outside of the 18+ chat. Remember you enter the 18+ chat at your own risk and follow the additional rules for the channel. (Porn allowed)**\n :four: **Don't impersonate other players.**\n :five:  **Don't advertise your servers in chat. Ask for the "Partners" role and we'll hook you up. 
**\n :six: **Feel free to tag the Owners and Moderators if you ever feel uncomfortable with something. We are here for you protection and care about your well being.
**\n :seven: **Be respectful. If you want respect you must give respect. Toxic behavior, racism, misogyny, bullying and spamming is not allowed.(unless Red approves)**\n :eight: **Keep chat to respective channels. Bot commands should be in #bot-room, youtube videos at #youtube and so on.**\n :nine: ** Show proof. These are for the gold roles. If you are below 10 million, you are required to post a screenshot of your gold amount. However, for those who have over 10 million, you are required to upload a video of your gold. Please check the pinned messages at #recently-gold-media. No proof means no role.**`)

message.channel.send(emb)

    message.delete();
    }
