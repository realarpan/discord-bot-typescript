/**
 * Ready Event Handler
 * Executes when the bot is ready and logs in
 * @module events/ready
 * @author realarpan
 */
import { Client } from "discord.js";
import fs from "fs";
import path from "path";

export default (client: Client) => {
  client.once("ready", async () => {
    // Command loader
    const commandFiles = getAllFiles(path.join(__dirname, "..", "commands"), ".ts");
    for (const file of commandFiles) {
      const command = (await import(file)).default;
      if (command) {
        client.commands.set(command.data.name, command);
      }
    }
    console.log(`Ready! Logged in as ${client.user?.tag} - Made by Arpan.`);
  });
};

// Recursively get all command files
function getAllFiles(dir: string, ext: string, files: string[] = []): string[] {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      getAllFiles(filepath, ext, files);
    } else if (filepath.endsWith(ext)) {
      files.push(filepath);
    }
  });
  return files;
}
