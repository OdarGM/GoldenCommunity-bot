const Discord = require('discord.js');
const config = require('../config.json')
exports.run = async (inv, message, args) => {
      if (["337343219128074240","363428457486483457"].indexOf(message.author.id) === -1){return;}
        let cmdparse = require("./cmdparse");
        message.content.slice(config.prefix.length)
        let data = message;
        let cmd = cmdparse(args.slice(0).join(" "));
        args.splice(0, 1);
        console.log({cmd});
        data.cmd = cmd;
        data.send = (($) => data.channel.send($));
        const newEmbed = require("./newEmbed")(Discord);
        (async () => {
            return (eval(`${data.cmd.join(" ")};`));
        })()
        .then(output => {
            data.send(newEmbed({
                title: "**Eval Success**",
                color: 0x00ff00,
                fields: [
                    { title: "Result:", value: output !== undefined ? output : true }
                ]
            })).catch(console.warn);
        })
        .catch((e) => {
            data.send(newEmbed({
                title: "**Eval Failed**",
                color: 0xff0000,
                fields: [
                    { title: "Result:", value: e.message }
                ]
            })).catch(console.warn);
        });
}

