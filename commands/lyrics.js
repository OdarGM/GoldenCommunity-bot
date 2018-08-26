const Discord = require('discord.js');
const package = require("../package.json");
const config = require("../config.json")
var songs =[];
exports.run = (inv, message, args) => {
    if(message.content.indexOf('?lyrics') != -1 && message.content != "?lyrics"){

                    var songName = message.content.substring("?lyrics".length).trim().toLowerCase();

                    var lyrics;
                    var formattedName;

                    for(var i = 0; i < songs.length ; i++){

                        if(songs[i].name.toLowerCase() == songName){
                            lyrics = songs[i].lyrics;
                            formattedName = songs[i].name;
                        }
                    }

                    if(lyrics == undefined){
                        message.channel.sendMessage("Sorry I couldn't find that song. Check for spelling mistakes.")
                    }
                    else{
                        message.channel.sendMessage("Here are the lyrics to *" + formattedName + "*" + "\n"+ lyrics);
                    }

                }
 }
