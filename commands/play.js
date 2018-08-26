const queue = new Map();
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const config = require("../config.json");
const KEY = config.KEY;
const youtube = new YouTube(KEY);
const {
    MessageCollector,
    RichEmbed
} = require('discord.js');
exports.run = async (inv, message, args) => {

    message.react("🎵")
    message.react("✅")
    let url = args.slice(0).join(" ");
    if (!url) return message.channel.send(":x: | Add a link or tell me what to search in order to play.");

    let voiceChannel;
    let GuildQueue = queue.get(message.guild.id);
    if (!GuildQueue) {
        voiceChannel = message.member.voiceChannel;
        //If user is not inside of any voice channel
        if (!voiceChannel) return message.channel.send(":x: | You must join a voice channel");
        let permissions = voiceChannel.permissionsFor(message.guild.me);
        //Validation
        if (!permissions.has("CONNECT")) return message.channel.send(":x: | I can't connect to that voice channel.");
        if (!permissions.has("SPEAK")) return message.channel.send(":x: | I don't have SPEAK permission in this channel.");
    };

    //Starting to sreach for song!
    let mm = await message.channel.send(":gear: Searching...");

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos(); //You can also set limit here!
        for (const video of Object.values(videos)) {
            const video2 = await youtube.getChannelByID(video.id);
            await handleMusic(message, video2, voiceChannel, mm);
        };

        mm.edit(`Added playlist ${playlist.title} to queue!`);

    }
    try {
        const video = await youtube.getVideo(url);
        await handleMusic(message, video, voiceChannel, mm);
    } catch (err) {
        try {
            const videos = await youtube.searchVideos(url, 5).catch(err => {
                mm.edit(":x: | No videos found :/")
            });

            var i = 1;
            const emb = new RichEmbed()
                .setColor("#0cbddd")
                .setDescription(`**Choose song from 1 to 5**\n\n${videos.map(val => `${i++} | ${val.title}`).join("\n")}`)
            await mm.edit(emb);

            const collector = new MessageCollector(message.channel, (message2) => message2.author.id === message.author.id && message2.content > 0 && message2.content < 6, {
                maxMatches: 1,
                time: 10000,
                errors: ['time']
            });

            collector.on("collect", async (message3) => {

                const index = parseInt(message3.content);
                const video = await youtube.getVideoByID(videos[index - 1].id);
                await handleMusic(message, video, voiceChannel, mm);
            });
        } catch (error) {
            mm.edit(":x: | Failed to find videos");
        }
    }
}



async function handleMusic(message, video, vc, mm) {

    let GuildQueue = queue.get(message.guild.id);

    const song = {
        id: video.id,
        name: video.title,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        requester: message.author,
        duration: video.durationSeconds
    };

    if (!GuildQueue) {
        GuildQueue = {
            songs: [],
            channel: message.channel,
            voiceChannel: null,
            connection: null,
            playing: false,
            dispatcher: null,
            volume: 0.5,
            maxLength: 3600
        }
        if (song.duration > GuildQueue.maxLength) return message.reply(":warning: This song is long. Please change guild settings to allow longer songs!");
        queue.set(message.guild.id, GuildQueue);
        GuildQueue.songs.push(song);
        try {
            var connection = await vc.join();
            GuildQueue.connection = connection;
            await startPlaying(message.guild, GuildQueue.songs[0]);
        } catch (err) {
            console.log(err);
            mm.edit(":x: | Failed to join a voice channel!");
            queue.delete(message.guild.id);
        }
    } else {
        if (song.duration > GuildQueue.maxLength) return message.reply(":x: | This song is bigger than the max length of the queue. Change guild settings to allow longer songs.");
        if (GuildQueue.songs.reduce((prev, song) => prev + song.duration, 0) > GuildQueue.maxLength) return mm.edit("You reached maximum song length!");
        GuildQueue.songs.push(song);
        mm.edit(`Added **${song.name}** to queue!`);
    }

}

function startPlaying(guild, song) {
    const GuildQueue = queue.get(guild.id);

    if (!song) {

    };

    const stream = ytdl(song.url, {
        audioonly: true
    });

    const dispatcher = GuildQueue.connection.playStream(stream);

    dispatcher.on("start", () => {
        GuildQueue.playing = true;
        GuildQueue.channel.send(`Started playing **${song.name}** !`);
    });

    dispatcher.on("end", (reason) => {
        if (typeof reason !== "undefined") {
            console.log(reason);
        };

        setTimeout(() => {
            GuildQueue.songs.shift();
            if (!GuildQueue.songs.length) return;
            startPlaying(guild, GuildQueue.songs[0]);
        }, 1000);
    });

    dispatcher.on("error", (err) => {
        console.log(err);
    });

    dispatcher.setVolume(GuildQueue.volume);
}

module.exports.info = {
    name: "play",
    description: "play music from youtube",
    usage: "?play <name/link>"
}