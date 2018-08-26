const config = require("./config.json");
const package = require("./package.json");
const Discord = require('discord.js');
const sql = require("sqlite");
sql.open("./score.sqlite");
const fs = require("fs");
const figlet = require('figlet');
const prefix = config.prefix;
const inv = new Discord.Client();
inv.commands = new Discord.Collection();
inv.aliases = new Discord.Collection();
inv.playlists = new Discord.Collection();
//Logs of readyness
/*
const responseObject = {
    "ayy": "Ayy, lmao!",
    "wat": "Say what?",
    "lol": "lol indeed",
    "odii": "is nub"
};
*/
inv.on('ready', () => {
    inv.user.setActivity("?help", {
        type: "STREAMING",
        url: "https://twitch.tv/vellpro"
    })


    figlet('GD', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        console.log("")
        console.log("")
        console.log("Core by")
        figlet('Alphi', function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(data)
            figlet('==========', function(err, data) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                console.log(data)
            });
        });
    });
});


//cmd handler
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        inv.on(eventName, (...args) => eventFunction.run(inv, ...args));
    });
});
inv.on('guildMemberAdd',  member => {
  let welcome = inv.channels.get("478411912892252166"); //ez nou
  welcome.send(":Karma: What goes around, must come back around. :Karma: \n Hey!  `${member.toString()`} Welcome to Karma. Please read <#335251583233294346>. \n Karma is now recruiting for dedicated players to blow through the game. Help us grow stronger and your karma will be served. \n May your blade run red with the blood of our enemies \n Please type *agree* in <#478411912892252166>")
  
       let response =   welcome.awaitMessages(mg => {

        return mg.author.id === member.id;
    }, {max: 1})
    response = response.array()[0];

 if (response.content.toLowerCase() === "agree"){
        let role = member.guild.roles.find(role => {return role.id==="473723745471692801"});
        member.addRole(role);
        welcome.send("You now have access to the server, welcome to Karma <:hype:468081845787951106> and most importantly, enjoy your stay!!");
    }
    else{
        welcome.send("You did not meet the requirements, please contact an admin or try again.");
    }
});
 const responseObject = {
   "vell": "I was summoned? ",
   "Amy": "Amy is the queen :smirk:" ,
   "alphi": "Someone mentioned my master.. :eyes:"
   };
   
inv.on("message", message => {
    if (message.author.bot) return;
  if(responseObject[message.content]) {
    message.channel.send(responseObject[message.content]);
    }
  /*
    const swearWords = ["fuck"]
    if(swearWords.some(word => message.content.includes(word))) {
      message.delete()
      let swearEmbed = new Discord.RichEmbed()
      .addField(message.author.username, "has used a prohibited word")
      .addField(" If you wish to disable this feature please contact: ", "AlphAlphi#9839" )
      .setTimestamp()
      .setFooter(message.author.tag + " has earned a warning")
      message.channel.send(swearEmbed);
      } */
    if (message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    try {
        if (message.channel.type === "dm") {
            let embed1 = new Discord.RichEmbed() //info embed on ticket
                .setTitle("Error :x:")
                .setColor("db1212")
                .setDescription("DM Commands are not allowed!")
                .setFooter(`Version ` + package.version)
            message.channel.send(embed1)
            return;
        }
/*
        const responseObject = {
            "ayy": "Ayy, lmao!",
            "wat": "Say what?",
            "odii": "is
       */
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(inv, message, args);
    } catch (err) {

        console.error(err);
    }
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        } else {
            let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
            if (curLevel > row.level) {
                row.level = curLevel;
                sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
                message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
            }
            sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
        }
    }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
            sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        });
    });

    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(prefix + "level")) {
        sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
            if (!row) return message.reply("Your current level is 0");
            message.reply(`Your current level is ${row.level}`);
        });
    } else

    if (message.content.startsWith(prefix + "points")) {
        sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
            if (!row) return message.reply("Sadly you do not have any points yet! :slight_frown:");
            message.reply(`You currently have ${row.points} points, good going!`);
        });
    }

    if (responseObject[message.content]) {
        message.channel.send(responseObject[message.content]);
    }

});



inv.login(process.env.token);
