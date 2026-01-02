/**
 * Lock Channel Command Module
 * Locks the current channel for everyone except specified roles
 * @module commands/moderation/lock
 * @author realarpan
 * @version 1.0.0
 */
// src/commands/moderation/lock.ts
import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock the current channel for everyone."),

  async execute(interaction: any) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: "You don’t have permission to lock channels.", ephemeral: true });
    }

    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });

    await interaction.reply(`🔒 ${interaction.channel} has been locked.`);
  }
};
