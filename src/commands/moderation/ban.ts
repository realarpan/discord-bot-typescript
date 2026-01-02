/**
 * Ban Command Module
 * Handles banning members from Discord guilds
 * @module commands/moderation/ban
 * @author realarpan
 * @version 1.0.0
 */
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member from the server')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('The member to ban')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setDescription('Reason for banning the member')
            .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const member = interaction.options.getMember('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Check if target member exists and is kickable
    if (!member) {
        await interaction.reply({ content: 'Member not found.', ephemeral: true });
        return;
    }

    if (!member.kickable) {
        await interaction.reply({ content: 'I cannot ban this member. They might have a higher role than me.', ephemeral: true });
        return;
    }

    try {
        await member.ban(reason);
        await interaction.reply({ content: `✅ ${member.user.tag} has been banned. Reason: ${reason}` });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Failed to ban the member.', ephemeral: true });
    }
};
