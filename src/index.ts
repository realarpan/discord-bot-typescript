      /**
 * Discord Bot Entry Point
 * Initializes the Discord client with necessary intents and event handlers
 * @author realarpan
 * @version 1.0.0
 */
import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";

// Load environment configuration
dotenv.config();

// Initialize Discord bot client with gateway intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
});

// Set up command collection for command handling
client.commands = new Collection();

// Register event handlers for client ready and interaction creation
ready(client);
interactionCreate(client);

// Start the bot with authentication token from environment
client.login(process.env.TOKEN);//put your bot token in .env
