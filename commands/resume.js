exports.run = (inv, message) => {
  const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
    return message.reply("Please join a voice channel first!");
  }
  if (!inv.playlists.get(message.guild.id).dispatcher.paused) return message.reply("Playback has not been paused. :play_pause: ");
  message.channel.send("Resuming playback :play_pause: ");
  inv.playlists.get(message.guild.id).dispatcher.resume();
};

exports.conf = {
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "resume",
  description: "Resumes the audio stream.",
  usage: "Resume"
};
