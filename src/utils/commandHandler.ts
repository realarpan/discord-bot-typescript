/**
 * Command Handler Utility Module
 * Loads and registers all command modules from the commands directory
 * @module utils/commandHandler
 * @author realarpan
 */
// src/utils/commandHandler.ts

import { Client } from "discord.js";
import fs from "fs";
import path from "path";

/**
 * Loads all command modules from the commands directory and registers them.
 */
export default (client: Client) => {
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles: string[] = [];

  // Recursively read all .ts files in commands subfolders
  function getCommandFiles(dir: string) {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) getCommandFiles(fullPath);
      else if (file.endsWith(".ts") || file.endsWith(".js")) commandFiles.push(fullPath);
    }
  }
  getCommandFiles(commandsPath);

  for (const file of commandFiles) {
    const command = require(file).default;
    if (command && command.data?.name) {
      client.commands.set(command.data.name, command);
    }
  }
};
