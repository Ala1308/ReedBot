const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const config = require('./config');
const progressManager = require('./progressManager');
const onboardingFlow = require('./onboardingFlow');
const { handleShiftChatCommand, handleShiftButton } = require('./shiftModule');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Stockage temporaire pour les quiz en cours
const activeQuizzes = new Map();

client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log('🟢 Bot is online and ready!');
  console.log(`📊 Tracking ${progressManager.getAllUsers().length} users' progress`);
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Handle shift commands first
  if (await handleShiftChatCommand(interaction)) return;

  // Commande /start_onboarding - Formation Niveau 1
  if (interaction.commandName === 'start_onboarding') {
    // Vérifier que la commande est utilisée dans le bon canal
    if (interaction.channelId !== config.channels.onboarding) {
      await interaction.reply({
        content: '❌ Cette commande doit être utilisée dans le canal <#' + config.channels.onboarding + '>',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('🎓 Formation Niveau 1 - Centre Reed')
      .setDescription(
        'Bienvenue ! Cette formation te permettra d\'apprendre le processus d\'appariement et de postuler aux offres.\n\n' +
        '**Ce que tu vas accomplir :**\n' +
        '• 📹 Vidéo : Processus d\'appariement & bidding\n' +
        '• 📝 Quiz de validation\n' +
        '• ✍️ Test pratique\n\n' +
        '**Résultat :**\n' +
        '✅ Rôle **Tuteur - Niveau 1**\n' +
        '🔓 Accès au canal pour postuler aux offres'
      )
      .addFields(
        { name: '⏱️ Durée estimée', value: '10-15 minutes' }
      )
      .setFooter({ text: 'Centre Reed - Formation N1' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('start_n1_flow')
        .setLabel('🚀 Commencer Formation N1')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }

  // Commande /finish_onboarding - Formation Niveau 2
  if (interaction.commandName === 'finish_onboarding') {
    // Vérifier que la commande est utilisée dans le bon canal
    if (interaction.channelId !== config.channels.onboarding) {
      await interaction.reply({
        content: '❌ Cette commande doit être utilisée dans le canal <#' + config.channels.onboarding + '>',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Vérifier que l'utilisateur a le rôle N1A (Apparié)
    const guild = interaction.guild;
    const member = await guild.members.fetch(interaction.user.id);
    const hasN1A = config.roles.tuteurN1A && member.roles.cache.has(config.roles.tuteurN1A);

    if (!hasN1A) {
      await interaction.reply({
        content: '❌ **Tu ne peux pas encore accéder à cette formation.**\n\n' +
          'Pour faire la Formation Niveau 2, tu dois :\n' +
          '1️⃣ Compléter la Formation Niveau 1 (`/start_onboarding`)\n' +
          '2️⃣ Postuler à une offre dans le canal des contrats\n' +
          '3️⃣ Être accepté et recevoir le rôle **Tuteur - Apparié (N1A)**\n\n' +
          '**Reviens ensuite pour finir ton onboarding !** 🎓',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🎓 Formation Niveau 2 - Centre Reed')
      .setDescription(
        'Félicitations pour ton appariement ! 🎉\n\n' +
        'Cette formation finale te préparera à donner tes premières séances.\n\n' +
        '**Ce que tu vas accomplir :**\n' +
        '• 📹 3 Vidéos : TutorBird, Premières séances, FAQ\n' +
        '• 📝 3 Quiz de validation\n\n' +
        '**Résultat :**\n' +
        '✅ Rôle **Tuteur - Niveau 2 (Actif)**\n' +
        '🔓 Accès au canal **#équipe**'
      )
      .addFields(
        { name: '⏱️ Durée estimée', value: '20-30 minutes' }
      )
      .setFooter({ text: 'Centre Reed - Formation N2' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('start_n2_flow')
        .setLabel('🚀 Commencer Formation N2')
        .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }
});

// Handle button interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const userId = interaction.user.id;

  // Handle shift buttons first
  if (await handleShiftButton(interaction)) return;

  // Start N1 flow
  if (interaction.customId === 'start_n1_flow') {
    try {
      // Create private thread for N1
      const thread = await interaction.channel.threads.create({
        name: `Formation N1 - ${interaction.user.username}`,
        autoArchiveDuration: 1440, // 24 hours
        type: 12, // Private thread
        reason: 'Formation Niveau 1 - Appariement & Bidding',
      });

      await thread.members.add(userId);

      // Set progress to N1-01
      progressManager.setUserProgress(userId, 'N1-01');

      await sendStep(thread, userId, 'N1-01');

      await interaction.reply({
        content: `✅ Ton thread de Formation Niveau 1 a été créé : ${thread}\n\nSuis les instructions à l'intérieur !`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Error creating thread:', error);
      await interaction.reply({
        content: '❌ Erreur lors de la création du thread. Contacte un administrateur.',
        flags: [MessageFlags.Ephemeral],
      });
    }
    return;
  }

  // Start N2 flow
  if (interaction.customId === 'start_n2_flow') {
    try {
      // Create private thread for N2
      const thread = await interaction.channel.threads.create({
        name: `Formation N2 - ${interaction.user.username}`,
        autoArchiveDuration: 1440, // 24 hours
        type: 12, // Private thread
        reason: 'Formation Niveau 2 - TutorBird & Séances',
      });

      await thread.members.add(userId);

      // Set progress to N2-01
      progressManager.setUserProgress(userId, 'N2-01');

      await sendStep(thread, userId, 'N2-01');

      await interaction.reply({
        content: `✅ Ton thread de Formation Niveau 2 a été créé : ${thread}\n\nSuis les instructions à l'intérieur !`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Error creating thread:', error);
      await interaction.reply({
        content: '❌ Erreur lors de la création du thread. Contacte un administrateur.',
        flags: [MessageFlags.Ephemeral],
      });
    }
    return;
  }

  // Handle step progression buttons
  if (interaction.customId.startsWith('btn_')) {
    const progress = progressManager.getUserProgress(userId);
    const currentStepId = progress.currentStep;
    const currentStep = onboardingFlow[currentStepId];

    if (!currentStep) {
      await interaction.reply({
        content: '❌ Erreur : étape introuvable.',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Regular step progression
    if (currentStep.type !== 'quiz' && currentStep.type !== 'practice' && currentStep.nextStep) {
      progressManager.setUserProgress(userId, currentStep.nextStep);
      await sendStep(interaction.channel, userId, currentStep.nextStep);
      await interaction.deferUpdate();
      return;
    }

    // Practice step (N1-04)
    if (currentStep.type === 'practice') {
      if (currentStep.onSuccess) {
        // Assign roles
        const guild = interaction.guild;
        const member = await guild.members.fetch(userId);

        if (currentStep.onSuccess.addRoles) {
          for (const roleKey of currentStep.onSuccess.addRoles) {
            const roleId = config.roles[roleKey];
            if (roleId && !roleId.startsWith('ROLE_ID_')) {
              try {
                await member.roles.add(roleId);
                console.log(`✅ Rôle ${roleKey} ajouté à ${member.user.tag}`);
              } catch (err) {
                console.error(`Error adding role ${roleKey}:`, err);
              }
            }
          }
        }

        const successEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('✅ Formation complétée !')
          .setDescription(currentStep.onSuccess.message)
          .setTimestamp();

        await interaction.update({
          embeds: [successEmbed],
          components: [],
        });

        // Archive thread after completion
        setTimeout(async () => {
          if (interaction.channel.isThread()) {
            await interaction.channel.setArchived(true);
          }
        }, 15000);
      }
      return;
    }

    // Quiz step
    if (currentStep.type === 'quiz') {
      // Start quiz
      await startQuiz(interaction, userId, currentStep);
      return;
    }
  }

  // Handle quiz answer selection
  if (interaction.customId.startsWith('quiz_answer_')) {
    await handleQuizAnswer(interaction, userId);
    return;
  }

  // Handle quiz retry
  if (interaction.customId.startsWith('quiz_retry_')) {
    const stepId = interaction.customId.replace('quiz_retry_', '');
    await startQuiz(interaction, userId, onboardingFlow[stepId]);
    return;
  }

  // Handle quiz review (go back to previous step)
  if (interaction.customId.startsWith('quiz_review_')) {
    const stepId = interaction.customId.replace('quiz_review_', '');
    const step = onboardingFlow[stepId];
    if (step.onFail && step.onFail.retryStep) {
      progressManager.setUserProgress(userId, step.onFail.retryStep);
      await sendStep(interaction.channel, userId, step.onFail.retryStep);
      await interaction.deferUpdate();
    }
    return;
  }
});

async function sendStep(channel, userId, stepId) {
  const step = onboardingFlow[stepId];
  if (!step) {
    await channel.send(`❌ Erreur : étape ${stepId} introuvable.`);
    return;
  }

  const levelColors = {
    1: '#FFA500', // Orange for N1
    2: '#00FF00', // Green for N2
  };

  const embed = new EmbedBuilder()
    .setColor(levelColors[step.level] || '#5865F2')
    .setTitle(step.title)
    .setDescription(step.description || '');

  if (step.fields) {
    embed.addFields(step.fields);
  }

  if (step.footer) {
    embed.setFooter({ text: step.footer });
  }

  embed.setTimestamp();

  const components = [];

  if (step.buttons && step.type !== 'quiz') {
    const row = new ActionRowBuilder();
    for (const btn of step.buttons) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(btn.id)
          .setLabel(btn.label)
          .setStyle(ButtonStyle[btn.style] || ButtonStyle.Primary)
      );
    }
    components.push(row);
  }

  if (step.type === 'quiz') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`btn_start_quiz_${stepId}`)
        .setLabel('📝 Commencer le quiz')
        .setStyle(ButtonStyle.Primary)
    );
    components.push(row);
  }

  await channel.send({
    content: `<@${userId}>`,
    embeds: [embed],
    components: components,
  });
}

async function startQuiz(interaction, userId, step) {
  const quizData = {
    stepId: step.id,
    currentQuestion: 0,
    answers: [],
    questions: step.questions,
  };

  activeQuizzes.set(userId, quizData);

  await sendQuizQuestion(interaction, userId, quizData, true);
}

async function sendQuizQuestion(interaction, userId, quizData, isFirstQuestion = false) {
  const question = quizData.questions[quizData.currentQuestion];
  const questionNum = quizData.currentQuestion + 1;
  const totalQuestions = quizData.questions.length;

  const embed = new EmbedBuilder()
    .setColor('#FFA500')
    .setTitle(`❓ Question ${questionNum}/${totalQuestions}`)
    .setDescription(question.q)
    .setFooter({ text: `Quiz : ${onboardingFlow[quizData.stepId].title}` })
    .setTimestamp();

  const rows = [];
  
  // Create buttons for each option (max 5 per row)
  for (let i = 0; i < question.options.length; i++) {
    if (i % 5 === 0) {
      rows.push(new ActionRowBuilder());
    }
    const currentRow = rows[rows.length - 1];
    
    const optionLabel = ['A', 'B', 'C', 'D', 'E'][i];
    const optionText = question.options[i].length > 60 
      ? question.options[i].substring(0, 57) + '...'
      : question.options[i];
    
    currentRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`quiz_answer_${i}`)
        .setLabel(`${optionLabel}: ${optionText}`)
        .setStyle(ButtonStyle.Secondary)
    );
  }

  await interaction.update({
    embeds: [embed],
    components: rows,
  });
}

async function handleQuizAnswer(interaction, userId) {
  const quizData = activeQuizzes.get(userId);
  if (!quizData) {
    await interaction.reply({
      content: '❌ Quiz introuvable. Recommence.',
      ephemeral: true,
    });
    return;
  }

  const answerIndex = parseInt(interaction.customId.split('_')[2]);
  quizData.answers.push(answerIndex);

  // Move to next question or finish quiz
  quizData.currentQuestion++;

  if (quizData.currentQuestion < quizData.questions.length) {
    // More questions remaining
    await sendQuizQuestion(interaction, userId, quizData, false);
  } else {
    // Quiz complete - evaluate
    await evaluateQuiz(interaction, userId, quizData);
  }
}

async function evaluateQuiz(interaction, userId, quizData) {
  const step = onboardingFlow[quizData.stepId];
  
  let correctCount = 0;
  for (let i = 0; i < quizData.questions.length; i++) {
    if (quizData.answers[i] === quizData.questions[i].correctIndex) {
      correctCount++;
    }
  }

  const passed = correctCount === quizData.questions.length;
  
  progressManager.recordQuizAttempt(userId, quizData.stepId, passed);

  if (passed) {
    // Quiz passed
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ Quiz réussi !')
      .setDescription(`${step.passMessage}\n\n**Score : ${correctCount}/${quizData.questions.length}**`)
      .setTimestamp();

    const components = [];
    
    if (step.onPass.nextStep) {
      progressManager.setUserProgress(userId, step.onPass.nextStep);
      
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('btn_continue_next')
          .setLabel('➡️ Continuer')
          .setStyle(ButtonStyle.Success)
      );
      components.push(row);
    }

    await interaction.update({
      embeds: [embed],
      components: components,
    });

    // Assign roles if needed
    if (step.onPass.addRoles) {
      const guild = interaction.guild;
      const member = await guild.members.fetch(userId);

      for (const roleKey of step.onPass.addRoles) {
        const roleId = config.roles[roleKey];
        if (roleId && !roleId.startsWith('ROLE_ID_')) {
          try {
            await member.roles.add(roleId);
            console.log(`✅ Rôle ${roleKey} ajouté à ${member.user.tag}`);
          } catch (err) {
            console.error(`Error adding role ${roleKey}:`, err);
          }
        }
      }

      if (step.onPass.removeRoles) {
        for (const roleKey of step.onPass.removeRoles) {
          const roleId = config.roles[roleKey];
          if (roleId && !roleId.startsWith('ROLE_ID_')) {
            try {
              await member.roles.remove(roleId);
            } catch (err) {
              console.error(`Error removing role ${roleKey}:`, err);
            }
          }
        }
      }
    }

    // Send completion message if final step
    if (!step.onPass.nextStep && step.onPass.message) {
      setTimeout(async () => {
        const completionEmbed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle('🎉 Formation complétée !')
          .setDescription(step.onPass.message)
          .setTimestamp();

        await interaction.channel.send({
          content: `<@${userId}>`,
          embeds: [completionEmbed],
        });

        // Archive thread after completion
        setTimeout(async () => {
          if (interaction.channel.isThread()) {
            await interaction.channel.setArchived(true);
          }
        }, 10000);
      }, 2000);
    } else if (step.onPass.nextStep) {
      // Send next step
      setTimeout(async () => {
        await sendStep(interaction.channel, userId, step.onPass.nextStep);
      }, 2000);
    }
  } else {
    // Quiz failed
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ Quiz échoué')
      .setDescription(`${step.failMessage}\n\n**Score : ${correctCount}/${quizData.questions.length}**\n\nTu dois obtenir un score parfait pour continuer.`)
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`quiz_review_${step.id}`)
          .setLabel('↩️ Revoir le contenu')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`quiz_retry_${step.id}`)
          .setLabel('🔁 Refaire le quiz')
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  }

  activeQuizzes.delete(userId);
}

// Admin commands
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  // Check admin permission
  const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
  if (!isAdmin) return;

  // !reset @user - Reset user progress
  if (message.content.startsWith('!reset ')) {
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) {
      progressManager.resetUserProgress(mentionedUser.id);
      await message.reply(`✅ Progression de ${mentionedUser.tag} réinitialisée.`);
    } else {
      await message.reply('❌ Usage: `!reset @user`');
    }
    return;
  }

  // !progress @user - Check user progress
  if (message.content.startsWith('!progress ')) {
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) {
      const progress = progressManager.getUserProgress(mentionedUser.id);
      const step = onboardingFlow[progress.currentStep];
      await message.reply(
        `📊 **Progression de ${mentionedUser.tag}**\n` +
        `Étape actuelle : ${progress.currentStep}${step ? ` - ${step.title}` : ''}\n` +
        `Tentatives de quiz : ${JSON.stringify(progress.quizAttempts, null, 2)}`
      );
    } else {
      await message.reply('❌ Usage: `!progress @user`');
    }
    return;
  }

  // !reset_roles @user - Remove all onboarding roles from user
  if (message.content.startsWith('!reset_roles ')) {
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) {
      try {
        const guild = message.guild;
        const member = await guild.members.fetch(mentionedUser.id);
        
        const rolesToRemove = [
          config.roles.tuteurN1,
          config.roles.tuteurN1A,
          config.roles.tuteurN2,
        ].filter(roleId => roleId && !roleId.startsWith('ROLE_ID_'));

        let removedCount = 0;
        for (const roleId of rolesToRemove) {
          if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);
            removedCount++;
          }
        }

        await message.reply(
          `✅ **Rôles réinitialisés pour ${mentionedUser.tag}**\n` +
          `${removedCount} rôle(s) retiré(s).\n\n` +
          `💡 Utilise aussi \`!reset @${mentionedUser.tag}\` pour réinitialiser la progression.`
        );
      } catch (error) {
        console.error('Error resetting roles:', error);
        await message.reply(`❌ Erreur lors de la réinitialisation des rôles : ${error.message}`);
      }
    } else {
      await message.reply('❌ Usage: `!reset_roles @user`');
    }
    return;
  }

  // !help - Show admin commands
  if (message.content === '!help' || message.content === '!admin') {
    await message.reply(
      '**🔧 Commandes Admin - Bot Onboarding**\n\n' +
      '`!progress @user` - Voir la progression d\'un utilisateur\n' +
      '`!reset @user` - Réinitialiser la progression d\'un utilisateur\n' +
      '`!reset_roles @user` - Retirer tous les rôles d\'onboarding\n' +
      '`!help` - Afficher cette aide'
    );
    return;
  }
});

client.login(config.token);
