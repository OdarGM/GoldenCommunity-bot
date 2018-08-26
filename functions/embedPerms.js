module.exports = (message) => {
  if (!message.guild) return true;
  return message.channel.permissionsFor(message.inv.user).hasPermission("EMBED_LINKS");
};
