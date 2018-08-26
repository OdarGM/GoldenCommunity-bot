exports.run = async (inv, message) => {
    if (["337343219128074240", "466458515829948436"].indexOf(message.author.id) === -1) return message.reply("Only owner can use this command | :x:")
    message.channel.send("Are you sure you want to reboot?\n\nReply with `cancel` to abort the reboot. The reboot will self-abort in 30 seconds.");

    const validAnswers = ["yes", "y", "no", "n", "cancel"];
    const collector = message.channel.createCollector(m => m.author.id === message.author.id, {
        time: 30000
    });

    collector.on("message", async m => {
        const lower = m.content.toLowerCase();
        if (lower === "cancel" || lower === "no" || lower === "n") {
            return collector.stop("abort");
        } else if (lower === "yes" || lower === "y") {
            return collector.stop("kill");
        }
        return message.channel.send(`Only \`${validAnswers.join("`, `")}\` are valid, please supply one of those.`);
    });

    collector.on("end", async (collected, reason) => {
        if (reason === "kill") {
            await message.channel.send("Rebooting now...");
            await inv.destroy();
            require("child_process").exec("vellrestart");
        } else if (reason === "time") {
            return message.channel.send("Reboot timed out.");
        } else if (reason === "abort") {
            return message.channel.send("Aborting reboot.");
        }
    });

};

exports.conf = {
    aliases: [],
    permLevel: 10
};

exports.help = {
    name: "reboot",
    description: "This reboots the bot.",
    usage: "reboot"
};