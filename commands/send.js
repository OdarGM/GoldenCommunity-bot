const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json");
const database = require("sqlite3objs");
require("./user.js");
const userdb = new database("../userboard.db");

exports.run = (inv, message, args) => {
    let toSend = parseInt(args[1]) || -1;
    let user = userdb.select("users", {
        where: {
            userID: message.author.id
        }
    });
    if (!user.length) {
        userdb.insert("users", {
            userID: message.author.id,
            cash: 0
        });
        user = userdb.select("users", {
            where: {
                userID: message.author.id
            }
        });
    }
    user = user[0];
    const update = (obj) => {
        userdb.update("users", {
            userID: message.author.id
        }, obj);
        user = userdb.select("users", {
            where: {
                userID: message.author.id
            }
        })[0];
    };
    let mentions = message.mentions.users.array();
    //
    if (message.author.id === mentions[0].id) return (message.reply( "You can't send money to yourself"));
    if (!mentions.length) return (message.reply("Please mention someone to send money to."));
    let touser = userdb.select("users", {
        where: {
            userID: mentions[0].id
        }
    });
    if (!touser.length) return (message.reply("This user is not registered in our system!"));
    touser.cash = parseInt(touser.cash);
    user.cash = parseInt(user.cash);
    if (toSend < 1) return(message.reply("Please provide a positive number of cash to send!"));
    if (user.cash < toSend) return(message.reply("Insuffecient funds!"));
    touser = touser[0];
    update({
        cash: user.cash - toSend
    });
    userdb.update("users", {
        userID: touser.userID
    }, {
        cash: touser.cash + toSend
    });
    message.reply(`sent ${toSend} to <@${touser.userID}>!`);
};