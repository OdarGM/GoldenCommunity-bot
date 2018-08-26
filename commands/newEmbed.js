const oo = (Discord) => {
    const newEmbed = (({
        title,
        desc,
        fields,
        color,
        footer,
        timestamp,
        url,
        image_url,
        thumb_url,
        author
    }) => {
        let embed = new Discord.RichEmbed();
        if (title !== undefined) {
            embed.setTitle(title);
        }
        if (desc !== undefined) {
            embed.setDescription(desc);
        }
        if (color !== undefined) {
            embed.setColor(color);
        }
        if (footer !== undefined) {
            embed.setFooter(footer);
        }
        if (timestamp !== undefined) {
            embed.setTimestamp(timestamp);
        }
        if (author !== undefined) {
            if (author instanceof String) {
                author = {
                    name: author
                };
            }
            embed.setAuthor(author);
        }
        if (image_url !== undefined) {
            embed.setImage(image_url);
        }
        if (url !== undefined) {
            embed.setURL(url);
        }
        if (thumb_url !== undefined) {
            embed.setThumbnail(thumb_url);
        }
        if (fields === undefined) {
            fields = [];
        }
        fields.forEach(field => {
            if ([true, false].includes(field)) {
                embed.addBlankField(field);
            } else {
                if (field.inline === undefined) {
                    field.inline = false;
                }
                embed.addField(field.title, field.value, field.inline);
            }
        });
        return (embed);
    });
    return(newEmbed);
};
module.exports = oo;
