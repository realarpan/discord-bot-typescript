/**
 * Kick Command Module
 * Removes a member from the Discord guild
 * @module commands/moderation/kick
 * @author realarpan
 * @version 1.0.0
 */
// kick.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('The member to kick')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setDescription('Reason for kicking the member')
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
        await interaction.reply({ content: 'I cannot kick this member. They might have a higher role than me.', ephemeral: true });
        return;
    }

    try {
        await member.kick(reason);
        await interaction.reply({ content: `✅ ${member.user.tag} has been kicked. Reason: ${reason}` });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Failed to kick the member.', ephemeral: true });
    }
};
