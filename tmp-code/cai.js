const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();
require('dotenv').config();


(async () => {
  // Authenticating as a guest (use `.authenticateWithToken()` to use an account)
  await characterAI.authenticateWithToken(process.env.CAI_TOKEN);

  // Place your character's id here
  const characterId = "U3dJdreV9rrvUiAnILMauI-oNH838a8E_kEYfOFPalE";

  // Create a chat object to interact with the conversation
  const chat = await characterAI.createOrContinueChat(characterId);

  // Send a message
  const response = await chat.sendAndAwaitResponse("Hello what is your name?", true);

  console.log(response);
  // Use `response.text` to use it as a string
})();