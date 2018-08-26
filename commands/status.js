
const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json")
exports.run = (inv, message, args) => {
        const request = require("request")
        const got = require("got")
        request(`http://game.aq3d.com/api/game/ServerList`, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                let parsed = JSON.parse(body);
                let embed = new Discord.RichEmbed()
                    .setColor("#00ff00")
                    .setTitle("AQ3D Server Status")
                    .setDescription("Artix Entertainment ©")
                    .addField("Total Online :earth_americas:", parsed[0].UserCount + parsed[1].UserCount)
                    .addField("Red Dragon :red_circle:", parsed[0].UserCount)
                    .addField("Blue Dragon :large_blue_circle:", parsed[1].UserCount)
                    .setFooter("© Vell Bot, Developed by Alphi#5113")
                    .setThumbnail("https://cdn.glitch.com/69253168-486e-4092-900b-0b35bbb192e1%2Fimagen.png?1527102788239")
                console.log(parsed)
                message.channel.send(embed);
                message.author.send(embed);

            }

        });

    }


