/**
 * Clear Command Module
 * Bulk deletes messages from a Discord channel
 * @module commands/moderation/clear
 * @author realarpan
 * @version 1.0.0
 */
import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear recent messages.")
    .addIntegerOption(o => o.setName("amount").setDescription("Number of messages (max 100)").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger("amount", true);
    const channel = interaction.channel;
    if (!channel || !("bulkDelete" in channel)) return interaction.reply("Not a text or news channel.");
    await (channel as any).bulkDelete(amount, true);
    await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true });
  }
};
