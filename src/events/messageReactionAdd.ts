/**
 * Message Reaction Add Event Handler
 * Handles emoji reactions added to messages
 * @module events/messageReactionAdd
 * @author realarpan
 */
// src/events/messageReactionAdd.ts
import { Events } from "discord.js";

export default {
  name: Events.MessageReactionAdd,
  async execute(reaction: any, user: any) {
    if (user.bot) return;

    const reactionRoleMessageId = "MESSAGE_ID"; // message to watch
    const roleId = "ROLE_ID"; // role to assign

    if (reaction.message.id === reactionRoleMessageId) {
      const role = reaction.message.guild.roles.cache.get(roleId);
      const member = reaction.message.guild.members.cache.get(user.id);
      if (role && member) await member.roles.add(role);
    }
  },
};
