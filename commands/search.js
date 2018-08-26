
const ytapi = require("simple-youtube-api");
const youtube = new ytapi("AIzaSyBs13PG8jLmeL-DWWd34c190Ggi6sl7TP8");

exports.run = async (inv, message, args) => {
  const search = args.join(" ");
  try {
    const results = await youtube.searchVideos(search, 5);
    return message.channel.send(`Top 5 Results\n\n🎧 ${results.map(i => `${i.title}\n🔗 https://www.youtube.com/watch?v=${i.id}\n`).join("\n🎧 ")}`, {code:true});
  } catch (e) {
    message.reply(e.message);
  }

};

exports.conf = {
  enabled:true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "search",
  description: "Finds a song on YouTube",
  usage: "search [search term]"
};
