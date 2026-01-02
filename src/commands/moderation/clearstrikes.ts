/**
 * Clear Strikes Command Module
 * Clears all strike warnings for a member
 * @module commands/moderation/clearstrikes
 * @author realarpan
 * @version 1.0.0
 */
import { SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { clearStrikes } from "../../util/strikeManager";

export default {
  data: new SlashCommandBuilder()
    .setName("clearstrikes")
    .setDescription("Clear all strikes for a member.")
    .addUserOption(option =>
      option.setName("target")
        .setDescription("The member")
        .setRequired(true)
    ),

  async execute(interaction: any) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: "You don’t have permission to clear strikes.", ephemeral: true });
    }

    const target = interaction.options.getUser("target");
    clearStrikes(target.id);

    await interaction.reply(`✅ All strikes for ${target.tag} have been cleared.`);
  }
};
