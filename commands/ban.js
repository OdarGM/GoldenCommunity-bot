const discord = require('discord.js');

exports.run = (inv, message, params) => {
    message.react("✅")
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Sorry, you don't have permissions to use this!");

    let mention = message.mentions.users.first();
    var notmentiond = new discord.RichEmbed()
        .setAuthor(`Error!`, ("https://cdn.discordapp.com/attachments/447558366076731394/447839283437371392/false-2061131_960_720.png"))
        .setColor(`#ff0000`)
        .setTimestamp()
        .setDescription(`Please mention a user!`)
    if (!mention) return message.channel.send(notmentiond), message.react("🚫");
    let guildmember = message.guild.member(mention);

    var target = inv.users.find('id', guildmember.id)

    target.send(`You have been banned from: ${message.guild.name}`).then(() => {
        guildmember.ban().then(() => {
            var success = new discord.RichEmbed()
                .setAuthor(`Success!`, ("https://cdn.discordapp.com/attachments/447558366076731394/448089730073231360/unknown.png"))
                .setColor(`#15ff00`)
                .setTimestamp()
                .setDescription(`Ban successful!`)
            message.channel.send(success)

        }
        )
    }
    )
};

exports.conf = {
    name: 'ban',
    aliases: ['permkick'],
    permLevel: 1,
    enabled: true,
    guildOnly: true
};
