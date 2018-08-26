const Discord = require('discord.js');
const config = require ('../config.json')
const fs = require('fs')

exports.run = (inv, message, args) => {
        message.react("✅")
        const urban = require("urban");
        if (args.length < 1) return message.reply("Please enter something!");
        let forsrh = args.join(" ");
        urban(forsrh).first(json => {
            if (!json) return message.reply("No results found!");
            let Dictionary = new Discord.RichEmbed()
                .setTitle(json.word)
                .setColor(0x550055)
                .setDescription(json.definition)
                .addField("Upvotes", json.thumbs_up, true)
                .addField("Downvotes", json.thumbs_down, true)
                .setFooter(`Author: ${json.author}`);

            message.channel.send(Dictionary);
        });
};
