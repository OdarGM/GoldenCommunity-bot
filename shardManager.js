const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./start.js');
Manager.spawn(1);