/**
 * User Info Command Module
 * Displays detailed information about a Discord user
 * @module commands/utility/userinfo
 * @author realarpan
 */
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Display information about a user')
  .addUserOption(option =>
    option
      .setName('target')
      .setDescription('The user to get information about')
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser('target') || interaction.user;
  const targetMember = interaction.guild?.members.cache.get(targetUser.id);

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`User Information - ${targetUser.username}`)
    .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: '👤 Username', value: targetUser.username, inline: true },
      { name: '🆔 User ID', value: targetUser.id, inline: true },
      { name: '🤖 Bot', value: targetUser.bot ? 'Yes' : 'No', inline: true },
      { 
        name: '📅 Account Created', 
        value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`,
        inline: false 
      }
    )
    .setTimestamp()
    .setFooter({ text: `Requested by ${interaction.user.username}` });

  if (targetMember) {
    embed.addFields(
      { 
        name: '📥 Joined Server', 
        value: targetMember.joinedAt 
          ? `<t:${Math.floor(targetMember.joinedAt.getTime() / 1000)}:F>` 
          : 'Unknown',
        inline: false 
      },
      { 
        name: '🎭 Roles', 
        value: targetMember.roles.cache
          .filter(role => role.id !== interaction.guild?.id)
          .map(role => role.toString())
          .join(', ') || 'No roles',
        inline: false 
      }
    );
  }

  await interaction.reply({ embeds: [embed] });
}
