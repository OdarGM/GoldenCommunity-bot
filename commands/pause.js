exports.run = (inv, message) => {
  const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
    return message.reply("Please join a voice channel first!");
  }
  if (inv.playlists.get(message.guild.id).dispatcher.paused) return message.reply("Playback is already paused. :pause_button:");
  message.channel.send("Pausing playback :pause_button:");
  inv.playlists.get(message.guild.id).dispatcher.pause();
};

exports.conf = {
  aliases: ["p"],
  permLevel: 2
};

exports.help = {
  name: "pause",
  description: "Pauses the audio stream.",
  usage: "Pause"
};
