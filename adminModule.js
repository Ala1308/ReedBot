const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require('discord.js');
const config = require('./config');
const progressManager = require('./progressManager');
const onboardingFlow = require('./onboardingFlow');

const isAdmin = (member) => member.permissions.has(PermissionFlagsBits.Administrator);

const adminCommands = [
  new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Gérer les commandes d’administration du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sc =>
      sc
        .setName('progress')
        .setDescription('Voir la progression d’un utilisateur')
        .addUserOption(o => o.setName('user').setDescription('Utilisateur à vérifier').setRequired(true))
    )
    .addSubcommand(sc =>
      sc
        .setName('reset')
        .setDescription('Réinitialiser la progression d’un utilisateur')
        .addUserOption(o => o.setName('user').setDescription('Utilisateur à réinitialiser').setRequired(true))
    )
    .addSubcommand(sc =>
      sc
        .setName('reset_roles')
        .setDescription('Retirer les rôles d’onboarding d’un utilisateur')
        .addUserOption(o => o.setName('user').setDescription('Utilisateur ciblé').setRequired(true))
    )
    .toJSON(),
];

async function handleAdminChatCommand(interaction) {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'admin') {
    return false;
  }

  if (!isAdmin(interaction.member)) {
    await interaction.reply({
      content: '❌ Les commandes /admin sont réservées aux administrateurs.',
      flags: [MessageFlags.Ephemeral],
    });
    return true;
  }

  const sub = interaction.options.getSubcommand();

  if (sub === 'progress') {
    const user = interaction.options.getUser('user');
    const progress = progressManager.getUserProgress(user.id);
    const step = onboardingFlow[progress.currentStep];
    const attempts = Object.keys(progress.quizAttempts || {}).length
      ? `\n\`\`\`json\n${JSON.stringify(progress.quizAttempts, null, 2)}\n\`\`\``
      : '\nAucune tentative de quiz enregistrée.';

    await interaction.reply({
      content:
        `📊 **Progression de ${user.tag}**\n` +
        `Étape actuelle : ${progress.currentStep}${step ? ` - ${step.title}` : ''}\n` +
        `N1 complété : ${progress.completedN1 ? 'oui' : 'non'}\n` +
        `Tentatives de quiz :${attempts}`,
      flags: [MessageFlags.Ephemeral],
    });
    return true;
  }

  if (sub === 'reset') {
    const user = interaction.options.getUser('user');
    progressManager.resetUserProgress(user.id);

    await interaction.reply({
      content: `✅ Progression de ${user.tag} réinitialisée.`,
      flags: [MessageFlags.Ephemeral],
    });
    return true;
  }

  if (sub === 'reset_roles') {
    const user = interaction.options.getUser('user');

    try {
      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id);

      const rolesToRemove = [
        config.roles.tuteurN1,
        config.roles.tuteurN1A,
        config.roles.tuteurN2,
      ].filter((roleId) => roleId && !roleId.startsWith('ROLE_ID_'));

      let removedCount = 0;
      for (const roleId of rolesToRemove) {
        if (member.roles.cache.has(roleId)) {
          await member.roles.remove(roleId);
          removedCount++;
        }
      }

      await interaction.reply({
        content:
          `✅ **Rôles réinitialisés pour ${user.tag}**\n` +
          `${removedCount} rôle(s) retiré(s).\n\n` +
          `💡 Utilise aussi \`/admin reset user:${user.username}\` pour réinitialiser la progression.`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      await interaction.reply({
        content: `❌ Erreur lors de la réinitialisation des rôles : ${error.message}`,
        flags: [MessageFlags.Ephemeral],
      });
    }
    return true;
  }

  return false;
}

async function handleLegacyAdminMessage(message) {
  if (!message.guild || message.author.bot) return false;
  if (!isAdmin(message.member)) return false;

  const isLegacyAdminCommand =
    message.content.startsWith('!progress ') ||
    message.content.startsWith('!reset ') ||
    message.content.startsWith('!reset_roles ') ||
    message.content === '!help' ||
    message.content === '!admin';

  if (!isLegacyAdminCommand) return false;

  try {
    await message.delete();
  } catch (error) {
    console.warn('⚠️ Impossible de supprimer la commande admin legacy:', error.message);
  }

  try {
    await message.author.send(
      'Les commandes admin textuelles ont été remplacées par des slash commands privées.\n\n' +
      'Utilise désormais :\n' +
      '• `/admin progress`\n' +
      '• `/admin reset`\n' +
      '• `/admin reset_roles`'
    );
  } catch (error) {
    console.warn('⚠️ Impossible d’envoyer le rappel des commandes admin en DM:', error.message);
  }

  return true;
}

module.exports = {
  adminCommands,
  handleAdminChatCommand,
  handleLegacyAdminMessage,
};
