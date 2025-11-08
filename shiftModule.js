const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const { randomUUID } = require('crypto');
const config = require('./config');
const {
  createShift,
  getShift,
  setShiftStatus,
  applyToShift,
  withdrawFromShift,
  listApplicants,
  assignShift,
  unassignShift,
  listMyAssignments,
  listAssignmentsByAdmin,
} = require('./shiftStore');

// Button ID helpers
const BTN = {
  APPLY: (id) => `shift_apply_${id}`,
  WD: (id) => `shift_withdraw_${id}`,
};

// Permission helpers
const isAdmin = (member) => member.permissions.has(PermissionFlagsBits.Administrator);

const hasAnyTutorRole = (m) =>
  m.roles.cache.has(config.roles.tuteurN1) ||
  m.roles.cache.has(config.roles.tuteurN1A) ||
  m.roles.cache.has(config.roles.tuteurN2);

const tutorSnapshot = (m) => {
  if (config.roles.tuteurN2 && m.roles.cache.has(config.roles.tuteurN2)) return 'N2';
  if (config.roles.tuteurN1A && m.roles.cache.has(config.roles.tuteurN1A)) return 'N1A';
  if (config.roles.tuteurN1 && m.roles.cache.has(config.roles.tuteurN1)) return 'N1';
  return 'unknown';
};

// Export slash command definition
const shiftCommands = [
  new SlashCommandBuilder()
    .setName('shift')
    .setDescription('Gérer les contrats de tutorat (Admins seulement)')
    .addSubcommand(sc =>
      sc
        .setName('post')
        .setDescription('Publier un nouveau contrat')
        .addStringOption(o => o.setName('title').setDescription('Titre du contrat').setRequired(true))
        .addStringOption(o =>
          o.setName('start_date').setDescription('Date de début (ex: 2025-11-15)').setRequired(true)
        )
        .addIntegerOption(o => o.setName('duration_hours').setDescription('Durée en HEURES par semaine').setRequired(true))
        .addStringOption(o => o.setName('availabilities').setDescription('Dispos élève (ex: Lun 18-22h, Mar 18-22h)').setRequired(true))
        .addStringOption(o => o.setName('description').setDescription('Description détaillée').setRequired(true))
        .addStringOption(o => o.setName('subjects').setDescription('Matières (séparées par virgule)').setRequired(false))
        .addStringOption(o => o.setName('shift_id').setDescription('ID personnalisé (optionnel)').setRequired(false))
    )
    .addSubcommand(sc =>
      sc
        .setName('applicants')
        .setDescription('Lister les candidats (admins)')
        .addStringOption(o => o.setName('shift_id').setDescription('ID du contrat').setRequired(true))
        .addStringOption(o => o.setName('filter_role').setDescription('Filtrer par rôle: N1, N1A ou N2').setRequired(false))
    )
    .addSubcommand(sc =>
      sc
        .setName('assign')
        .setDescription('Assigner un tuteur (admins)')
        .addStringOption(o => o.setName('shift_id').setDescription('ID du contrat').setRequired(true))
        .addUserOption(o => o.setName('user').setDescription('Tuteur à assigner').setRequired(true))
    )
    .addSubcommand(sc =>
      sc
        .setName('unassign')
        .setDescription('Retirer l\'assignation (admins)')
        .addStringOption(o => o.setName('shift_id').setDescription('ID du contrat').setRequired(true))
    )
    .addSubcommand(sc =>
      sc
        .setName('close')
        .setDescription('Fermer un contrat (admins)')
        .addStringOption(o => o.setName('shift_id').setDescription('ID du contrat').setRequired(true))
    )
    .addSubcommand(sc => sc.setName('my').setDescription('Voir tous mes contrats assignés (Admin)'))
    .toJSON(),
];

/**
 * Handle /shift command
 */
async function handleShiftChatCommand(interaction) {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'shift') {
    return false;
  }

  const sub = interaction.options.getSubcommand();

  // Admin-only for ALL shift commands
  if (!isAdmin(interaction.member)) {
    await interaction.reply({ content: '❌ Toutes les commandes /shift sont réservées aux administrateurs.', ephemeral: true });
    return true;
  }

  // /shift post
  if (sub === 'post') {
    const title = interaction.options.getString('title');
    const startDate = interaction.options.getString('start_date');
    const durationHours = interaction.options.getInteger('duration_hours');
    const availabilities = interaction.options.getString('availabilities');
    const description = interaction.options.getString('description');
    const subjects = (interaction.options.getString('subjects') || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const shiftId = interaction.options.getString('shift_id') || randomUUID();

    // Post in #appliquer-à-un-contrat
    const channel = await interaction.guild.channels.fetch(config.channels.contrats);
    
    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle(`📣 ${title}`)
      .setDescription(description)
      .addFields(
        { name: '📅 Date de début', value: startDate, inline: true },
        { name: '⏱️ Durée', value: `${durationHours}h/semaine`, inline: true },
        { name: '📚 Matières', value: subjects.length ? subjects.join(', ') : '—', inline: true },
        { name: '🗓️ Disponibilités élève', value: availabilities, inline: false }
      )
      .setFooter({ text: `ID: ${shiftId} • Statut: Ouvert` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(BTN.APPLY(shiftId))
        .setStyle(ButtonStyle.Primary)
        .setLabel('✅ Postuler'),
      new ButtonBuilder()
        .setCustomId(BTN.WD(shiftId))
        .setStyle(ButtonStyle.Secondary)
        .setLabel('↩️ Retirer')
    );

    const msg = await channel.send({ embeds: [embed], components: [row] });

    console.log('📝 Attempting to save shift to Firestore...');
    console.log('Guild ID:', interaction.guildId);
    console.log('Shift ID:', shiftId);
    
    try {
      await createShift(interaction.guildId, {
        shiftId,
        guildId: interaction.guildId,
        channelId: channel.id,
        messageId: msg.id,
        title,
        description,
        startDate,
        durationHours,
        availabilities,
        subjects,
        createdBy: interaction.user.id,
        status: 'open',
      });
      console.log('✅ Shift saved to Firestore successfully!');
    } catch (error) {
      console.error('❌ Error saving shift to Firestore:', error);
    }

    await interaction.reply({
      content: `✅ Contrat publié : **${title}**\nID: \`${shiftId}\``,
      ephemeral: true,
    });
    return true;
  }

  // /shift applicants
  if (sub === 'applicants') {
    const shiftId = interaction.options.getString('shift_id');
    const filterRole = interaction.options.getString('filter_role') || undefined;
    
    const apps = await listApplicants(interaction.guildId, shiftId, filterRole);
    
    if (!apps.length) {
      await interaction.reply({ content: '❌ Aucun candidat pour ce contrat.', ephemeral: true });
      return true;
    }

    const lines = apps.map(
      a => `• <@${a.userId}> — **${a.roleSnapshot || 'n/a'}** — Postulé: <t:${Math.floor(a.appliedAt / 1000)}:R>`
    );

    await interaction.reply({
      content: `**📋 Candidats pour ${shiftId}:**\n\n${lines.join('\n')}`,
      ephemeral: true,
    });
    return true;
  }

  // /shift assign
  if (sub === 'assign') {
    const shiftId = interaction.options.getString('shift_id');
    const user = interaction.options.getUser('user');
    
    const shift = await getShift(interaction.guildId, shiftId);
    
    if (!shift || shift.status !== 'open') {
      await interaction.reply({
        content: '❌ Ce contrat n\'est pas ouvert ou n\'existe pas.',
        ephemeral: true,
      });
      return true;
    }

    await assignShift(interaction.guildId, shiftId, user.id, interaction.user.id);

    // Role updates: N1 → N1A
    const member = await interaction.guild.members.fetch(user.id);
    const hasN2 = config.roles.tuteurN2 && member.roles.cache.has(config.roles.tuteurN2);
    const hasN1 = config.roles.tuteurN1 && member.roles.cache.has(config.roles.tuteurN1);
    const hasN1A = config.roles.tuteurN1A && member.roles.cache.has(config.roles.tuteurN1A);

    if (hasN2) {
      // Keep N2, do nothing
      console.log(`✅ Tuteur ${member.user.tag} est déjà N2, pas de changement de rôle`);
    } else if (hasN1 && !hasN1A && config.roles.tuteurN1A) {
      await member.roles.add(config.roles.tuteurN1A, 'Apparié à un contrat');
      console.log(`✅ Rôle N1A ajouté à ${member.user.tag}`);
    }

    // Create private thread
    const ch = await interaction.guild.channels.fetch(shift.channelId);
    const msg = await ch.messages.fetch(shift.messageId);
    
    const thread = await msg.startThread({
      name: `✅ Assigné • ${member.displayName}`,
      autoArchiveDuration: 1440, // 24 hours
    });

    await thread.members.add(user.id);
    await thread.send(
      `🎉 **Contrat assigné à <@${user.id}>**\n\n` +
      `📋 **${shift.title}**\n` +
      `📅 Date de début: ${shift.startDate || shift.whenIso || 'N/A'}\n` +
      `⏱️ Durée: ${shift.durationHours || shift.durationMin}${shift.durationHours ? 'h/semaine' : ' min'}\n` +
      `🗓️ Disponibilités: ${shift.availabilities || 'Non spécifié'}\n` +
      `📚 Matières: ${shift.subjects.join(', ')}\n\n` +
      `Merci de confirmer ta disponibilité !`
    );

    await interaction.reply({
      content: `✅ Contrat assigné à <@${user.id}> avec succès !`,
      ephemeral: true,
    });
    return true;
  }

  // /shift unassign
  if (sub === 'unassign') {
    const shiftId = interaction.options.getString('shift_id');
    await unassignShift(interaction.guildId, shiftId);
    
    await interaction.reply({
      content: `✅ Attribution retirée. Le contrat \`${shiftId}\` est ré-ouvert.`,
      ephemeral: true,
    });
    return true;
  }

  // /shift close
  if (sub === 'close') {
    const shiftId = interaction.options.getString('shift_id');
    await setShiftStatus(interaction.guildId, shiftId, 'closed');
    
    await interaction.reply({
      content: `✅ Contrat \`${shiftId}\` fermé aux candidatures.`,
      ephemeral: true,
    });
    return true;
  }

  // /shift my - Show all shifts assigned BY this admin
  if (sub === 'my') {
    const rows = await listAssignmentsByAdmin(interaction.guildId, interaction.user.id);
    
    if (!rows.length) {
      return interaction.reply({
        content: '📭 Tu n\'as assigné aucun contrat pour le moment.',
        ephemeral: true,
      });
    }

    const lines = rows.map(
      r => `• **Shift ${r.shiftId}** — Assigné à <@${r.userId}> • <t:${Math.floor(r.assignedAt / 1000)}:R>`
    );

    await interaction.reply({
      content: `**📋 Contrats que tu as assignés :**\n\n${lines.join('\n')}`,
      ephemeral: true,
    });
    return true;
  }

  return false;
}

/**
 * Handle shift buttons (Apply/Withdraw)
 */
async function handleShiftButton(interaction) {
  if (!interaction.isButton()) return false;

  const id = interaction.customId;
  const APPLY_REGEX = /^shift_apply_(.+)$/;
  const WD_REGEX = /^shift_withdraw_(.+)$/;

  // Apply button
  if (APPLY_REGEX.test(id)) {
    const shiftId = id.match(APPLY_REGEX)[1];
    const shift = await getShift(interaction.guildId, shiftId);

    if (!shift || shift.status !== 'open') {
      return interaction.reply({
        content: '❌ Ce contrat n\'est plus ouvert aux candidatures.',
        ephemeral: true,
      });
    }

    if (!hasAnyTutorRole(interaction.member)) {
      return interaction.reply({
        content: '❌ Tu dois être au moins **Tuteur - Niveau 1** pour postuler.',
        ephemeral: true,
      });
    }

    await applyToShift(
      interaction.guildId,
      shiftId,
      interaction.user.id,
      tutorSnapshot(interaction.member)
    );

    return interaction.reply({
      content: '✅ Ta candidature a été envoyée ! Les admins pourront la consulter.',
      ephemeral: true,
    });
  }

  // Withdraw button
  if (WD_REGEX.test(id)) {
    const shiftId = id.match(WD_REGEX)[1];
    await withdrawFromShift(interaction.guildId, shiftId, interaction.user.id);

    return interaction.reply({
      content: '↩️ Ta candidature a été retirée.',
      ephemeral: true,
    });
  }

  return false;
}

module.exports = {
  shiftCommands,
  handleShiftChatCommand,
  handleShiftButton,
};

