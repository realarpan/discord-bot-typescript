/**
 * Interaction Create Event Handler
 * Handles slash commands and interactions
 * @module events/interactionCreate
 * @author realarpan
 */
import { Client, Interaction } from "discord.js";

export default (client: Client) => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error executing this command.", ephemeral: true });
    }
  });
};
