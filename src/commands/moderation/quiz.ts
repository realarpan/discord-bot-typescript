/**
 * Quiz Command Module
 * Interactive trivia quiz game
 * @module commands/moderation/quiz
 * @author realarpan
 */
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} from 'discord.js';

interface Profile {
    trait: string;
    element: string;
    power: number;
    luck: number;
    charm: number;
}

const traits = ['Brave', 'Clever', 'Mysterious', 'Chill', 'Adventurous'];
const elements = ['Fire', 'Water', 'Earth', 'Air', 'Lightning'];

export default {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Discover your unique Discord character profile!'),

    async execute(interaction: ChatInputCommandInteraction) {
        const profile: Profile = {
            trait: '',
            element: '',
            power: 0,
            luck: 0,
            charm: 0
        };

        const questions = [
            {
                question: 'Pick a trait that best suits you:',
                options: traits
            },
            {
                question: 'Choose your elemental affinity:',
                options: elements
            },
            {
                question: 'Select your strongest skill:',
                options: ['Power', 'Luck', 'Charm']
            }
        ];

        let step = 0;

        const askQuestion = async () => {
            const row = new ActionRowBuilder<ButtonBuilder>();
            for (const option of questions[step].options) {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(option)
                        .setLabel(option)
                        .setStyle(ButtonStyle.Primary)
                );
            }

            if (step === 0) {
                await interaction.reply({ content: questions[step].question, components: [row] });
            } else {
                await interaction.followUp({ content: questions[step].question, components: [row] });
            }

            const collector = interaction.channel?.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 20000,
                max: 1
            });

            collector?.on('collect', async i => {
                if (i.user.id !== interaction.user.id) return;

                const choice = i.customId;

                // Record choice in profile
                if (step === 0) profile.trait = choice;
                else if (step === 1) profile.element = choice;
                else if (step === 2) {
                    if (choice === 'Power') profile.power = Math.floor(Math.random() * 50) + 50;
                    else if (choice === 'Luck') profile.luck = Math.floor(Math.random() * 50) + 50;
                    else if (choice === 'Charm') profile.charm = Math.floor(Math.random() * 50) + 50;
                }

                await i.update({ content: `You chose: **${choice}**`, components: [] });
                step++;

                if (step < questions.length) {
                    askQuestion();
                } else {
                    // Generate remaining random stats
                    profile.power = profile.power || Math.floor(Math.random() * 100);
                    profile.luck = profile.luck || Math.floor(Math.random() * 100);
                    profile.charm = profile.charm || Math.floor(Math.random() * 100);

                    // Show final profile
                    await interaction.followUp({
                        content: `✨ **Your Discord Character Profile** ✨\n
**Trait:** ${profile.trait}
**Element:** ${profile.element}
**Power:** ${profile.power}
**Luck:** ${profile.luck}
**Charm:** ${profile.charm}
                        `
                    });
                }
            });

            collector?.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({ content: '⏰ Time is up! Try again later.', components: [] });
                }
            });
        };

        askQuestion();
    }
};
