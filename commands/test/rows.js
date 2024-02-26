const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ChannelSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('Replies with anything!')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for banning')),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        // const confirm = new ButtonBuilder()
        //     .setCustomId('confirm')
        //     .setLabel('Confirm Ban')
        //     .setStyle(ButtonStyle.Danger)
        //     .setEmoji('👍');

        // const cancel = new ButtonBuilder()
        //     .setCustomId('cancel')
        //     .setLabel('Cancel')
        //     .setStyle(ButtonStyle.Secondary);

        // const row = new ActionRowBuilder()
        //     .addComponents(cancel, confirm);

        const userSelect = new ChannelSelectMenuBuilder()
			.setCustomId('users')
			.setPlaceholder('Select multiple users.')
			.setMinValues(1)
			.setMaxValues(10);

		const row = new ActionRowBuilder()
			.addComponents(userSelect);

        await interaction.reply({
            content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
            components: [row],
        });
    },
};