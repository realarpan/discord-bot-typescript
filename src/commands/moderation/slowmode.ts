/**
 * Slowmode Command Module
 * Sets slowmode for the current channel
 * @module commands/moderation/slowmode
 * @author realarpan
 */
// src/commands/moderation/slowmode.ts
import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode for the current channel.")
    .addIntegerOption(option =>
      option.setName("seconds")
        .setDescription("Number of seconds (0 = disable)")
        .setRequired(true)
    ),

  async execute(interaction: any) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: "You don’t have permission to change slowmode.", ephemeral: true });
    }

    const seconds = interaction.options.getInteger("seconds");

    if (seconds < 0 || seconds > 21600) {
      return interaction.reply({ content: "Slowmode must be between 0 and 21600 seconds.", ephemeral: true });
    }

    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply(`🐌 Slowmode has been set to **${seconds} seconds** in ${interaction.channel}.`);
  }
};
