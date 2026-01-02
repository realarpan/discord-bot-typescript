/**
 * Guild Member Add Event Handler
 * Executes when a new member joins the guild
 * @module events/guildMemberAdd
 * @author realarpan
 */
// src/events/guildMemberAdd.ts
import { Events } from "discord.js";

export default {
  name: Events.GuildMemberAdd,
  async execute(member: any) {
    const channelId = "CHANNEL_ID"; // replace with your welcome channel of discord
    const roleId = "AUTOROLE_ID"; // replace with default role of discord server

    const channel = member.guild.channels.cache.get(channelId);
    if (channel) channel.send(`👋 Welcome ${member}!`); // you can customize your welcome msg

    const role = member.guild.roles.cache.get(roleId);
    if (role) await member.roles.add(role);
  },
};
