const Discord = require("discord.js");

exports.run = (inv, message, args) => {
        
  
        if (message.channel.id !== "465277567491112972") return message.channel.send("You can use this command only in #staff-application");
        let chan = inv.channels.get("465277567491112972");
        let chan2 = inv.channels.get("465269674389667871");
        let msg = args.join(" ")
        if (!msg) return message.reply("Please add an application description before using the command. Example: ?submit I am awesome");

        chan.send(`${message.author} Application Enqueued. Please Wait.`);
        
        let emb = new Discord.RichEmbed()
        .setColor("#00ff00")
        .setDescription(msg)
        .setFooter("Sent by " + message.author.tag)

        chan2.send(emb);
    }

 
    
