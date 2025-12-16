      import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
});

client.commands = new Collection();

ready(client);
interactionCreate(client);

client.login(process.env.TOKEN);//put your bot token in .env
