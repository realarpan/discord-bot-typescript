/**
 * Mute Command Module
 * Mutes a member for a specified duration
 * @module commands/moderation/mute
 * @author realarpan
 */
import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout a user for X minutes.")
    .addUserOption(o => o.setName("target").setDescription("User to mute").setRequired(true))
    .addIntegerOption(o => o.setName("minutes").setDescription("Number of minutes").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("target", true);
    const member = interaction.guild!.members.cache.get(user.id);
    const minutes = interaction.options.getInteger("minutes", true);
    if (!member) return interaction.reply("Member not found.");
    await member.timeout(minutes * 60 * 1000);
    await interaction.reply(`Muted ${user.tag} for ${minutes} minutes.`);
  }
};
