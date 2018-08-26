const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json");
const database = require("sqlite3objs");
require("./user.js");
const userdb = new database("../userboard.db");

exports.run = (inv, message, args) => {
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
    user = userdb.select("users", {
        where: {
            userID: message.author.id
        }
    });
    user = user[0];
    const update = (obj) => {
        userdb.update("users", {
            userID: message.author.id
        }, obj);
        user = userdb.select("users", {
            where: {
                userID: message.author.id
            }
        });
        console.log()
    };
    message.reply(`You have ${user.cash} VBucks!`);
};