/**
 * Dictionary Command Module
 * Provides word definitions via API
 * @module commands/moderation/dictionary
 * @author realarpan
 */
// dictionary.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export const data = new SlashCommandBuilder()
    .setName('define')
    .setDescription('Get an advanced definition of a word')
    .addStringOption(option =>
        option.setName('word')
            .setDescription('Word to define')
            .setRequired(true)
    );

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const word = interaction.options.getString('word', true);

    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data[0];

        const embed = new EmbedBuilder()
            .setTitle(`Definition of "${data.word}"`)
            .setColor(0x00AE86);

        data.meanings.forEach((meaning: any) => {
            const definitions = meaning.definitions.map((def: any, index: number) => {
                let text = `${index + 1}. ${def.definition}`;
                if (def.example) text += `\n   _Example_: ${def.example}`;
                if (def.synonyms && def.synonyms.length > 0) text += `\n   _Synonyms_: ${def.synonyms.join(', ')}`;
                return text;
            }).join('\n\n');

            embed.addFields({ name: meaning.partOfSpeech, value: definitions || 'No definitions found.' });
        });

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error(error);
        await interaction.reply({ content: `❌ Could not find a definition for "${word}".`, ephemeral: true });
    }
};
