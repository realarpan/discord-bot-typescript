/**
 * Purge Command Module
 * Deletes multiple messages at once
 * @module commands/moderation/purge
 * @author realarpan
 */
// src/commands/moderation/purge.ts
import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete multiple messages at once.")
    .addIntegerOption(option =>
      option.setName("amount")
        .setDescription("Number of messages to delete (max 100)")
        .setRequired(true)
    ),

  async execute(interaction: any) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: "You lack permission to manage messages.", ephemeral: true });
    }

    const amount = interaction.options.getInteger("amount");
    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: "You must choose between 1 and 100 messages.", ephemeral: true });
    }

    await interaction.channel.bulkDelete(amount, true);
    interaction.reply({ content: `🧹 Deleted **${amount}** messages.`, ephemeral: true });
  }
};
