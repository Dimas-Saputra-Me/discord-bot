const { SlashCommandBuilder, ChannelSelectMenuBuilder, ActionRowBuilder, ChannelType, ComponentType, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// Select Channel
		const userSelect = new ChannelSelectMenuBuilder()
			.setCustomId('channel')
			.addChannelTypes(ChannelType.GuildVoice)
			.setPlaceholder('Select Channel.');

		const row1 = new ActionRowBuilder()
			.addComponents(userSelect);

		const message = await interaction.reply({
			content: 'Select channel:',
			components: [row1],
		})

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.ChannelSelect, time: 5000, max: 1 });

		collector.on('collect', i => {
			if (i.user.id === interaction.user.id) {
				i.deferUpdate();

				// Bot Join
				const connections = joinVoiceChannel({
					channelId: i.values[0],
					guildId: interaction.guildId,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});

				// Player
				const player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Pause,
					},
				});

				const ytdlProcess = ytdl("https://www.youtube.com/watch?v=JdSpuTi9d8A&pp=ygUGb3Jhbmdl", { filter: "audioonly" })

				player.play(createAudioResource(ytdlProcess));
				connections.subscribe(player)
			} else {
				i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
			}
		});

		return;
	},
};