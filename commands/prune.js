const discord = require('discord.js');

exports.run = (inv, message, args) => {
message.delete()

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permissions to do that!");
  if(!args[0]) return message.channel.send("Please enter a number of messages to prune! ");
  message.channel.bulkDelete(args[0]).then(() => {
  message.channel.send(`**__Pruned ${args[0]} messages.__**`).then(msg => msg.delete(2000));
});
}
