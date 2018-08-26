const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json");
const database = require("sqlite3objs");
require("./user.js");
const userdb = new database("../userboard.db");

exports.run = (inv, message, args) => {
    let user;
    user = userdb.select("users", {
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
    if (new Date().getTime() < user.lastDaily + (1000 * 60 * 60 * 24)) {
        return (message.reply("Please wait the full 24 hrs before claiming again!"));
    }
    update({
        cash: user.cash + 100,
        lastDaily: new Date().getTime()
    });
    message.reply(`You have received your daily 100 VBucks!\nYou now have ${user.cash} VBucks!`);
};