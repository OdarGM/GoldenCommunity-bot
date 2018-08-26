exports.run = (inv, message) => {
  const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
    return message.reply("Please join a voice channel first!");
  }

  if(inv.playlists.has(message.guild.id)) {
    const queue = inv.playlists.get(message.guild.id);
    queue.queue = [];
    queue.dispatcher.end();
  }
};

exports.conf = {
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "stop",
  description: "Ends the current playlist.",
  usage: "Stop"
