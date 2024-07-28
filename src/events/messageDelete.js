module.exports = async (client, message) => {
  const embedBuilder = require("../utils/embeds");
  const cfg = require("../utils/config.json");

  if (!message || !message.guild || !message.author) {
    console.error('Message, guild, or author is null/undefined');
    return;
  }

  if (message.guild.id !== cfg.guildID) return;
  if (message.author.bot) return;

  await client.channelLogs.messageLog.send({
    embeds: [embedBuilder.messageD(client, message)],
  });
};
