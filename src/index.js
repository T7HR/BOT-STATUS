const { Client, GatewayIntentBits, Partials } = require("discord.js");
const version = require("../package.json").version;
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const discordModals = require('discord-modals');
const { Logger } = require("term-logger");
const { readdir } = require("fs");
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CommandHandler } = require('djs-commander');
require("dotenv").config();

process.title = `Server Logger Bot | ${version}`;
console.clear();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  allowedMentions: {
    parse: ["everyone", "roles", "users"],
  },
});

// Use term-logger globally
client.log = Logger;

readdir("./src/events", (err, files) => {
  if (err) {
    return Logger.error(err);
  }

  let eventFiles = files.filter((file) => file.endsWith(".js"));

  eventFiles.forEach((file) => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));

    Logger.event(`Successfully registered event ${eventName}.js`);
  });
});

discordModals(client);

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'slash-commands'),
  eventsPath: path.join(__dirname, 'events'),
});


client.login(process.env.TOKEN);
