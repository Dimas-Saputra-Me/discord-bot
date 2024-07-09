const { SlashCommandBuilder } = require('discord.js');

// Character AI
const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();

// Concurrent Request
const {Mutex} = require('async-mutex');
const mutex = new Mutex();

// Env
require('dotenv').config();


module.exports = {
	cooldown: 0,
	data: new SlashCommandBuilder()
		.setName('hutao')
		.setDescription('Chat with Hu Tao!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Insert your message')
                .setRequired(true)),
	async execute(interaction) {
        // Generate/Get Chat Id
        const chatId = interaction.user.id;

        await interaction.deferReply();

        // Authenticating as a guest (use `.authenticateWithToken()` to use an account)
        if(!characterAI.isAuthenticated()){
            await characterAI.authenticateWithToken(process.env.CAI_TOKEN);
        }

        // Place your character's id here
        const characterId = "U3dJdreV9rrvUiAnILMauI-oNH838a8E_kEYfOFPalE";

        // Create a chat object to interact with the conversation
        const chat = await characterAI.createOrContinueChat(characterId);

        const response = await mutex.runExclusive(async () => {
            return await chat.sendAndAwaitResponse(interaction.options.getString("message"), true);
        });

		interaction.editReply(response.text)
	},
};