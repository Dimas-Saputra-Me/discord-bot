const { SlashCommandBuilder } = require('discord.js');
const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();
require('dotenv').config();

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('hutao')
		.setDescription('Chat with Hu Tao!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Insert your message')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();

        // Authenticating as a guest (use `.authenticateWithToken()` to use an account)
        if(!characterAI.isAuthenticated()){
            await characterAI.authenticateWithToken(process.env.CAI_TOKEN);
        }

        // Place your character's id here
        const characterId = "U3dJdreV9rrvUiAnILMauI-oNH838a8E_kEYfOFPalE";

        // Create a chat object to interact with the conversation
        const chat = await characterAI.createOrContinueChat(characterId);

        // Send a message
        const response = await chat.sendAndAwaitResponse(interaction.options.getString("message"), true);

		interaction.editReply(response.text)
	},
};