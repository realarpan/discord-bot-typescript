/**
 * Warn Command Module
 * Issues warnings to members for violations
 * @module commands/moderation/warn
 * @author realarpan
 */
import { SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { addStrike, getStrikes } from "../../util/strikeManager";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member (adds a strike).")
    .addUserOption(option =>
      option.setName("target")
        .setDescription("The member to warn")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("Reason for the warning")
        .setRequired(false)
    ),

  async execute(interaction: any) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: "You don’t have permission to warn members.", ephemeral: true });
    }

    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") || "No reason provided";

    const strikes = addStrike(target.id, interaction.user.tag, reason);

    await interaction.reply(`⚠️ ${target.tag} has been warned. They now have **${strikes.length} strike(s)**.`);

    // 🔥 Auto-action: 3 strikes = timeout (mute for 10 minutes)
    if (strikes.length >= 3) {
      try {
        const member = await interaction.guild.members.fetch(target.id);
        await member.timeout(10 * 60 * 1000, "Reached 3 strikes");
        await interaction.followUp(`🚫 ${target.tag} has been muted for 10 minutes (3 strikes).`);
      } catch {
        await interaction.followUp("⚠️ Could not timeout the user automatically.");
      }
    }
  }
};
