const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Play music!')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Phrase to search for')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Insert your music youtube link')
                .setRequired(true)),

    async execute(interaction) {
        const channelID = interaction.options.getChannel('channel').id
        const linkMusic = interaction.options.getString("link")

        // Bot Join
        const connections = joinVoiceChannel({
            channelId: channelID,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
            const newUdp = Reflect.get(newNetworkState, 'udp');
            clearInterval(newUdp?.keepAliveInterval);
        }

        connections.on('stateChange', (oldState, newState) => {
            const oldNetworking = Reflect.get(oldState, 'networking');
            const newNetworking = Reflect.get(newState, 'networking');

            oldNetworking?.off('stateChange', networkStateChangeHandler);
            newNetworking?.on('stateChange', networkStateChangeHandler);
        });

        // Player
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        const ytdlProcess = ytdl(linkMusic, { filter: "audioonly" })

        player.play(createAudioResource(ytdlProcess));
        connections.subscribe(player)

        return interaction.reply("Success Played Song");
    },
};
