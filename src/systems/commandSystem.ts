/**
 * Discord Bot Command System
 * Manages command registration, execution, and error handling
 */

import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
  cooldown?: number; // in milliseconds
}

class CommandSystem {
  private commands: Map<string, Command>;
  private cooldowns: Map<string, Map<string, number>>;

  constructor() {
    this.commands = new Map();
    this.cooldowns = new Map();
  }

  /**
   * Register a command
   */
  register(command: Command): void {
    const commandName = command.data.name;
    this.commands.set(commandName, command);
    console.log(`✓ Registered command: ${commandName}`);
  }

  /**
   * Get a registered command
   */
  get(commandName: string): Command | undefined {
    return this.commands.get(commandName);
  }

  /**
   * Execute a command with cooldown check
   */
  async execute(commandName: string, interaction: CommandInteraction): Promise<void> {
    const command = this.commands.get(commandName);
    if (!command) {
      await interaction.reply({ content: 'Command not found!', ephemeral: true });
      return;
    }

    // Check cooldown
    if (command.cooldown) {
      const now = Date.now();
      const cooldownKey = `${commandName}-${interaction.user.id}`;
      
      if (!this.cooldowns.has(commandName)) {
        this.cooldowns.set(commandName, new Map());
      }

      const userCooldowns = this.cooldowns.get(commandName)!;
      const expirationTime = userCooldowns.get(cooldownKey);

      if (expirationTime) {
        if (now < expirationTime) {
          const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
          await interaction.reply({
            content: `Please wait ${timeLeft}s before using this command again.`,
            ephemeral: true,
          });
          return;
        }
      }

      userCooldowns.set(cooldownKey, now + command.cooldown);
    }

    // Execute command
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      const errorMessage = { content: 'An error occurred while executing this command.', ephemeral: true };
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }

  /**
   * Get all registered commands
   */
  getAll(): SlashCommandBuilder[] {
    return Array.from(this.commands.values()).map(cmd => cmd.data);
  }

  /**
   * Get command count
   */
  getCommandCount(): number {
    return this.commands.size;
  }
}

export default new CommandSystem();
