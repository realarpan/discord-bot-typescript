/**
 * Unlock Channel Command Module
 * Unlocks the current channel
 * @module commands/moderation/unlock
 * @author realarpan
 */
// src/commands/moderation/unlock.ts
import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock the current channel for everyone."),

  async execute(interaction: any) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: "You don’t have permission to unlock channels.", ephemeral: true });
    }

    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: true
    });

    await interaction.reply(`🔓 ${interaction.channel} has been unlocked.`);
  }
};
