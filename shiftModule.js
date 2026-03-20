const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
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
  listShiftsByCreator,
  listActiveAssignments,
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

const parseDateInput = (value, endOfDay = false) => {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
};

const formatDiscordTime = (timestampMs) => {
  if (!timestampMs) return 'N/A';
  const ts = Math.floor(timestampMs / 1000);
  return `<t:${ts}:d> • <t:${ts}:R>`;
};

// Export slash command definition
const shiftCommands = [
  new SlashCommandBuilder()
    .setName('shift')
    .setDescription('Gérer les contrats de tutorat (Admins seulement)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
    .addSubcommand(sc =>
      sc
        .setName('my')
        .setDescription('Voir les contrats que tu gères avec filtres')
        .addStringOption(o =>
          o
            .setName('status')
            .setDescription('Filtrer par statut')
            .setRequired(false)
            .addChoices(
              { name: 'Tous', value: 'all' },
              { name: 'Assignés', value: 'assigned' },
              { name: 'Non assignés', value: 'unassigned' },
              { name: 'Ouverts', value: 'open' },
              { name: 'Fermés', value: 'closed' }
            )
        )
        .addIntegerOption(o =>
          o
            .setName('year')
            .setDescription('Année de publication (ex: 2026)')
            .setRequired(false)
            .setMinValue(2024)
            .setMaxValue(2100)
        )
        .addStringOption(o =>
          o.setName('subject').setDescription('Filtrer par matière').setRequired(false)
        )
        .addStringOption(o =>
          o.setName('published_after').setDescription('Publié à partir de YYYY-MM-DD').setRequired(false)
        )
        .addStringOption(o =>
          o.setName('published_before').setDescription('Publié jusqu’à YYYY-MM-DD').setRequired(false)
        )
        .addIntegerOption(o =>
          o
            .setName('limit')
            .setDescription('Nombre max de résultats (1-50)')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(50)
        )
    )
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
    await interaction.reply({ 
      content: '❌ Toutes les commandes /shift sont réservées aux administrateurs.', 
      flags: [MessageFlags.Ephemeral] 
    });
    return true;
  }

  // /shift post
  if (sub === 'post') {
    // Defer reply for long operation
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
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

    await interaction.editReply({
      content: `✅ Contrat publié : **${title}**\nID: \`${shiftId}\``,
    });
    return true;
  }

  // /shift applicants
  if (sub === 'applicants') {
    const shiftId = interaction.options.getString('shift_id');
    const filterRole = interaction.options.getString('filter_role') || undefined;
    
    const apps = await listApplicants(interaction.guildId, shiftId, filterRole);
    
    if (!apps.length) {
      await interaction.reply({ 
        content: '❌ Aucun candidat pour ce contrat.', 
        flags: [MessageFlags.Ephemeral] 
      });
      return true;
    }

    const lines = apps.map(
      a => `• <@${a.userId}> — **${a.roleSnapshot || 'n/a'}** — Postulé: <t:${Math.floor(a.appliedAt / 1000)}:R>`
    );

    await interaction.reply({
      content: `**📋 Candidats pour ${shiftId}:**\n\n${lines.join('\n')}`,
      flags: [MessageFlags.Ephemeral],
    });
    return true;
  }

  // /shift assign
  if (sub === 'assign') {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
    
    const shiftId = interaction.options.getString('shift_id');
    const user = interaction.options.getUser('user');
    
    const shift = await getShift(interaction.guildId, shiftId);
    
    if (!shift || shift.status !== 'open') {
      await interaction.editReply({
        content: '❌ Ce contrat n\'est pas ouvert ou n\'existe pas.',
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

    await interaction.editReply({
      content: `✅ Contrat assigné à <@${user.id}> avec succès !`,
    });
    return true;
  }

  // /shift unassign
  if (sub === 'unassign') {
    const shiftId = interaction.options.getString('shift_id');
    await unassignShift(interaction.guildId, shiftId);
    
    await interaction.reply({
      content: `✅ Attribution retirée. Le contrat \`${shiftId}\` est ré-ouvert.`,
      flags: [MessageFlags.Ephemeral],
    });
    return true;
  }

  // /shift close
  if (sub === 'close') {
    const shiftId = interaction.options.getString('shift_id');
    await setShiftStatus(interaction.guildId, shiftId, 'closed');
    
    await interaction.reply({
      content: `✅ Contrat \`${shiftId}\` fermé aux candidatures.`,
      flags: [MessageFlags.Ephemeral],
    });
    return true;
  }

  // /shift my - Show contracts created by this admin with filters
  if (sub === 'my') {
    const statusFilter = interaction.options.getString('status') || 'all';
    const yearFilter = interaction.options.getInteger('year');
    const subjectFilter = (interaction.options.getString('subject') || '').trim().toLowerCase();
    const publishedAfterInput = interaction.options.getString('published_after');
    const publishedBeforeInput = interaction.options.getString('published_before');
    const limit = interaction.options.getInteger('limit') || 10;

    const publishedAfter = parseDateInput(publishedAfterInput, false);
    const publishedBefore = parseDateInput(publishedBeforeInput, true);

    if (publishedAfterInput && !publishedAfter) {
      return interaction.reply({
        content: '❌ Le filtre `published_after` doit être au format `YYYY-MM-DD`.',
        flags: [MessageFlags.Ephemeral],
      });
    }

    if (publishedBeforeInput && !publishedBefore) {
      return interaction.reply({
        content: '❌ Le filtre `published_before` doit être au format `YYYY-MM-DD`.',
        flags: [MessageFlags.Ephemeral],
      });
    }

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const [shifts, assignments] = await Promise.all([
      listShiftsByCreator(interaction.guildId, interaction.user.id),
      listActiveAssignments(interaction.guildId),
    ]);

    if (!shifts.length) {
      return interaction.editReply('📭 Tu n’as publié aucun contrat pour le moment.');
    }

    const assignmentMap = new Map(assignments.map((assignment) => [assignment.shiftId, assignment]));

    const rows = shifts
      .map((shift) => {
        const assignment = assignmentMap.get(shift.shiftId);
        const subjects = Array.isArray(shift.subjects) ? shift.subjects : [];
        const createdAt = shift.createdAt || null;
        const isAssigned = Boolean(assignment);
        const displayStatus = isAssigned ? 'assigné' : shift.status === 'closed' ? 'fermé' : 'ouvert';

        return {
          ...shift,
          subjects,
          createdAt,
          assignment,
          isAssigned,
          displayStatus,
        };
      })
      .filter((row) => {
        if (statusFilter === 'assigned' && !row.isAssigned) return false;
        if (statusFilter === 'unassigned' && row.isAssigned) return false;
        if (statusFilter === 'open' && row.status !== 'open') return false;
        if (statusFilter === 'closed' && row.status !== 'closed') return false;

        if (yearFilter && row.createdAt) {
          const createdYear = new Date(row.createdAt).getUTCFullYear();
          if (createdYear !== yearFilter) return false;
        }

        if (subjectFilter) {
          const haystack = row.subjects.join(', ').toLowerCase();
          if (!haystack.includes(subjectFilter)) return false;
        }

        if (publishedAfter && row.createdAt && row.createdAt < publishedAfter) return false;
        if (publishedBefore && row.createdAt && row.createdAt > publishedBefore) return false;

        return true;
      })
      .sort((a, b) => {
        const aTs = a.assignment?.assignedAt || a.createdAt || 0;
        const bTs = b.assignment?.assignedAt || b.createdAt || 0;
        return bTs - aTs;
      });

    if (!rows.length) {
      return interaction.editReply('📭 Aucun contrat ne correspond aux filtres demandés.');
    }

    const visibleRows = rows.slice(0, limit);
    const lines = visibleRows.map((row) => {
      const published = formatDiscordTime(row.createdAt);
      const subjects = row.subjects.length ? row.subjects.join(', ') : 'Matière non précisée';
      const assignmentLine = row.assignment
        ? `\n  Assigné à <@${row.assignment.userId}> le ${formatDiscordTime(row.assignment.assignedAt)}`
        : '\n  Non assigné pour le moment';

      return (
        `• **${row.title || `Shift ${row.shiftId}`}** \`${row.shiftId}\`` +
        `\n  Statut : **${row.displayStatus}**` +
        `\n  Matières : ${subjects}` +
        `\n  Publié : ${published}` +
        assignmentLine
      );
    });

    const appliedFilters = [
      `statut=${statusFilter}`,
      yearFilter ? `année=${yearFilter}` : null,
      subjectFilter ? `matière=${subjectFilter}` : null,
      publishedAfterInput ? `publié_après=${publishedAfterInput}` : null,
      publishedBeforeInput ? `publié_avant=${publishedBeforeInput}` : null,
      `limite=${limit}`,
    ].filter(Boolean);

    const header =
      `**📋 Contrats que tu gères** (${visibleRows.length}/${rows.length})\n` +
      `Filtres : ${appliedFilters.join(' • ')}\n\n`;

    const safeLines = [];
    let contentLength = header.length;
    for (const line of lines) {
      const nextLength = contentLength + line.length + (safeLines.length ? 2 : 0);
      if (nextLength > 1850) break;
      safeLines.push(line);
      contentLength = nextLength;
    }

    const truncatedNote =
      safeLines.length < visibleRows.length
        ? `\n\n… ${visibleRows.length - safeLines.length} résultat(s) masqué(s) pour tenir dans un seul message. Réduis \`limit\` ou affine les filtres.`
        : '';

    await interaction.editReply(header + safeLines.join('\n\n') + truncatedNote);
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
        flags: [MessageFlags.Ephemeral],
      });
    }

    if (!hasAnyTutorRole(interaction.member)) {
      return interaction.reply({
        content: '❌ Tu dois être au moins **Tuteur - Niveau 1** pour postuler.',
        flags: [MessageFlags.Ephemeral],
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
      flags: [MessageFlags.Ephemeral],
    });
  }

  // Withdraw button
  if (WD_REGEX.test(id)) {
    const shiftId = id.match(WD_REGEX)[1];
    await withdrawFromShift(interaction.guildId, shiftId, interaction.user.id);

    return interaction.reply({
      content: '↩️ Ta candidature a été retirée.',
      flags: [MessageFlags.Ephemeral],
    });
  }

  return false;
}

module.exports = {
  shiftCommands,
  handleShiftChatCommand,
  handleShiftButton,
};

