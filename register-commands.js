const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const config = require('./config');
const { shiftCommands } = require('./shiftModule');
const { adminCommands } = require('./adminModule');

const commands = [
  new SlashCommandBuilder()
    .setName('start_onboarding')
    .setDescription('Démarrer la Formation Niveau 1 (Discord et application)')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('finish_onboarding')
    .setDescription('Formation complète Reed (4 vidéos, 4 quiz) - Requiert rôle apparié')
    .toJSON(),
  ...shiftCommands,
  ...adminCommands,
];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('🔄 Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log('✅ Slash command registered successfully!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();

