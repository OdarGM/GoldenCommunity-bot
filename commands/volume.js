exports.run = (inv, message, args) => {
  const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
    return message.reply("Please be in a voice channel first!");
  }

  const vol = args.join(" ");
  if (!vol) return message.channel.send(`Current volume is set at ${client.playlists.get(message.guild.id).dispatcher.volume * 100}%`);
  if (vol < 0 || vol > 100) return message.reply("Volume must be a value between 0% and 100%");

  message.channel.send(`Setting volume to ${vol}%`).then(()=> {
    message.guild.voiceConnection.volume = vol / 100;
    inv.playlists.get(message.guild.id).dispatcher.setVolume(vol / 100);
  });
};

exports.conf = {
  aliases: ["v", "vol"],
  permLevel: 2
};

exports.help = {
  name: "volume",
  description: "Sets the streams volume.",
  usage: "volume [value]"
};
