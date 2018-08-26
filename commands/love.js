const Discord = require('discord.js');
exports.run = (inv, message, args) => {
    message.react("❤");
    const special_users = ["337343219128074240", "397150181184897027"];
    const mentions = message.mentions.users;
    if (mentions.size === 2) {
        let special = false;
        special_users.forEach((id) => {
            if (mentions.has(id)) {
                special = true;
            }
        });
        let percent = special ? 100 : Math.floor(Math.random() * 100);
        let extra = "";
        const extras = {
            "397150181184897027": "She belongs with Alphie <3",
            "337343219128074240": "He belongs to Enchantress <3"
        };
        const alwaysMatch = [
            ["397150181184897027", "337343219128074240"]
        ];
        Object.keys(extras).forEach((id) => {
            if (mentions.has(id)) {
                extra += "\n" + extras[id];
                percent = 0;
            }
        });
        alwaysMatch.forEach((ids) => {
            if (mentions.has(ids[0]) && mentions.has(ids[1])) percent = 100;
        });
        const love = new Discord.RichEmbed()
            .setTimestamp()
            .setColor(`#ff0000`)
            .addField(`${mentions.array()[0].username} and ${mentions.array()[1].username} have a: `, `${percent}% love connection.${extra}`);
        message.channel.send(love);
    } else message.channel.send(`Please mention (2) people.`);
}
