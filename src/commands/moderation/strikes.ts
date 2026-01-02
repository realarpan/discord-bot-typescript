/**
 * Strikes Command Module
 * Manages strike warnings for members
 * @module commands/moderation/strikes
 * @author realarpan
 */
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getStrikes } from "../../util/strikeManager";

export default {
  data: new SlashCommandBuilder()
    .setName("strikes")
    .setDescription("View strikes for a member.")
    .addUserOption(option =>
      option.setName("target")
        .setDescription("The member")
        .setRequired(true)
    ),

  async execute(interaction: any) {
    const target = interaction.options.getUser("target");
    const strikes = getStrikes(target.id);

    if (strikes.length === 0) {
      return interaction.reply(`${target.tag} has no strikes.`);
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Strikes for ${target.tag}`)
      .setColor("Orange")
      .setDescription(
        strikes.map((s, i) =>
          `**${i + 1}.** By: ${s.moderator}\nReason: ${s.reason}\n<t:${Math.floor(s.timestamp / 1000)}:R>`
        ).join("\n\n")
      );

    interaction.reply({ embeds: [embed] });
  }
};
