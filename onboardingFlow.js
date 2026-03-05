// Définition complète du flow d'onboarding Centre Reed
const config = require('./config');

module.exports = {
  // ============================================
  // NIVEAU 1 - Discord & Applications
  // Commande: /start_onboarding
  // Résultat: Rôle Tuteur N1 → Accès #offres
  // ============================================

  'N1-01': {
    id: 'N1-01',
    level: 1,
    title: '🎯 Bienvenue au Centre Reed - Formation Niveau 1',
    description: 'Bienvenue ! Tu vas maintenant apprendre à utiliser **Discord** et à **postuler aux offres** d\'élèves.\n\n**Ce que tu vas accomplir :**\n• Découvrir le canal #offres\n• Comprendre comment postuler aux offres\n• Débloquer le rôle **Tuteur - Niveau 1**',
    fields: [
      { name: '⏱️ Durée', value: '5-10 minutes' },
      { name: '🎯 Objectif', value: 'Obtenir le rôle **Tuteur N1** et accéder à #offres' },
    ],
    buttons: [
      { id: 'btn_N1_start', label: '🚀 Commencer', style: 'Primary' },
    ],
    nextStep: 'N1-02',
  },

  'N1-02': {
    id: 'N1-02',
    level: 1,
    title: 'Vidéo 1 — Discord & Applications',
    description: 'Découvre comment naviguer dans Discord et postuler aux offres d\'élèves.',
    fields: [
      { name: 'Lien', value: '🎬 [Regarder la vidéo](https://youtu.be/ham62aTgKw0)' },
      { name: '📱 Canal #offres', value: 'C\'est ici que les offres d\'élèves sont publiées' },
      { name: '✅ Comment postuler', value: 'Clique sur le bouton "Postuler" sous chaque offre pour soumettre ta candidature' },
      { name: '⏱️ Durée des offres', value: 'Les offres restent ouvertes 24h, postule rapidement !' },
      { name: '⏱️ Durée', value: '3-5 minutes' },
    ],
    buttons: [
      { id: 'btn_N1_video_done', label: '🎥 Vidéo complétée', style: 'Primary' },
    ],
    nextStep: 'N1-03',
  },

  'N1-03': {
    id: 'N1-03',
    level: 1,
    type: 'quiz',
    title: 'Quiz — Discord & Applications',
    description: 'Teste tes connaissances sur le processus de postulation.',
    questions: [
      {
        q: 'Où postules-tu aux offres d\'élèves ?',
        options: [
          'Sur le site web Centre Reed',
          'Dans le canal #offres sur Discord',
          'Par courriel à la direction',
          'Sur un formulaire externe',
        ],
        correctIndex: 1,
      },
      {
        q: 'Comment postuler à une offre ?',
        options: [
          'Envoyer un courriel',
          'Cliquer sur le bouton "Postuler" sous l\'offre',
          'Écrire un message dans le thread',
          'Remplir un formulaire externe',
        ],
        correctIndex: 1,
      },
      {
        q: 'Combien de temps une offre reste-t-elle ouverte ?',
        options: [
          '12 heures',
          '24 heures',
          '48 heures',
          'Jusqu\'à ce qu\'un tuteur soit trouvé',
        ],
        correctIndex: 1,
      },
    ],
    passMessage: '✅ Parfait ! Tu es prêt pour la suite.',
    failMessage: '❌ Revois la vidéo et réessaie.',
    onPass: {
      nextStep: 'N1-04',
    },
    onFail: {
      retryStep: 'N1-02',
    },
  },

  'N1-04': {
    id: 'N1-04',
    level: 1,
    type: 'completion',
    title: '🎉 Formation Niveau 1 Complétée !',
    description: 'Félicitations ! Tu as terminé la première étape de ta formation.',
    fields: [
      { name: '✅ Ce que tu as appris', value: '• Navigation Discord\n• Processus de postulation dans #offres\n• Comment cliquer sur "Postuler"' },
      { name: '🎁 Récompense', value: 'Tu viens de recevoir le rôle **Tuteur - Niveau 1** !' },
      { name: '🔓 Accès débloqué', value: 'Tu peux maintenant voir et postuler aux offres dans **#offres**' },
      { name: '➡️ Prochaine étape', value: 'Une fois que tu seras **accepté à une offre**, tu recevras le rôle **Tuteur - Apparié (N1A)**.\n\nTu pourras alors continuer ta formation complète avec `/finish_onboarding` !' },
    ],
    buttons: [
      { id: 'btn_N1_complete', label: '🎓 Terminer', style: 'Success' },
    ],
    onSuccess: {
      nextStep: null,
      addRoles: ['tuteurN1'],
      message: '🎉 **Tu es maintenant Tuteur - Niveau 1 !**\n\n🔓 Accès débloqué : <#' + config.channels.contrats + '>\n\n**Prochaine étape :** Postule à une offre et attends d\'être accepté pour continuer ta formation ! 💙',
    },
  },

  // ============================================
  // NIVEAU 2 - Formation Complète (N1A → N2)
  // Commande: /finish_onboarding (requiert rôle N1A)
  // Résultat: Rôle Tuteur N2 → Accès #annonce + #formation
  // ============================================

  'N2-01': {
    id: 'N2-01',
    level: 2,
    title: '🎉 Félicitations pour ton appariement !',
    description: 'Bravo ! Tu as été accepté à une offre et tu es maintenant **Tuteur - Apparié (N1A)**.\n\nCette formation complète te préparera à devenir un **tuteur actif** au Centre Reed.\n\n**Ce que tu vas apprendre :**\n• La **méthode pédagogique** Centre Reed\n• Utiliser **TutorBird**\n• Animer ta **séance découverte**\n• Structurer tes **séances récurrentes**',
    fields: [
      { name: '⏱️ Durée', value: '30-40 minutes' },
      { name: '🎯 Objectif', value: 'Obtenir le rôle **Tuteur N2 (Actif)** et accéder à #annonce + #formation' },
    ],
    buttons: [
      { id: 'btn_N2_start', label: '▶️ Commencer', style: 'Primary' },
    ],
    nextStep: 'N2-02',
  },

  'N2-02': {
    id: 'N2-02',
    level: 2,
    title: 'Vidéo 1 — Méthode Centre Reed',
    description: 'Découvre notre approche pédagogique unique pour le rattrapage et l\'enrichissement.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: '📉 Rattrapage', value: 'Méthode pour aider les élèves en difficulté à combler leurs lacunes et retrouver confiance' },
      { name: '📈 Enrichissement', value: 'Méthode pour stimuler les élèves avancés et développer leur plein potentiel' },
    ],
    buttons: [
      { id: 'btn_N2_v1_done', label: '🎥 Vidéo 1 vue', style: 'Primary' },
    ],
    nextStep: 'N2-03',
  },

  'N2-03': {
    id: 'N2-03',
    level: 2,
    type: 'quiz',
    title: 'Quiz — Méthode Centre Reed',
    description: 'Teste ta compréhension de la méthode pédagogique.',
    questions: [
      {
        q: 'La méthode Centre Reed pour le rattrapage vise à :',
        options: [
          'Faire uniquement des exercices répétitifs',
          'Combler les lacunes et redonner confiance à l\'élève',
          'Avancer plus vite dans le programme',
          'Se concentrer uniquement sur les examens',
        ],
        correctIndex: 1,
      },
      {
        q: 'L\'enrichissement sert à :',
        options: [
          'Rattraper les retards',
          'Développer le plein potentiel des élèves avancés',
          'Préparer les examens seulement',
          'Donner plus de devoirs',
        ],
        correctIndex: 1,
      },
    ],
    passMessage: '✅ Excellent ! Passons aux outils.',
    failMessage: '❌ Revois la vidéo et réessaie.',
    onPass: {
      nextStep: 'N2-04',
    },
    onFail: {
      retryStep: 'N2-02',
    },
  },

  'N2-04': {
    id: 'N2-04',
    level: 2,
    title: 'Vidéo 2 — Outils (TutorBird)',
    description: 'Apprends à utiliser TutorBird, la plateforme de gestion de tes séances.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: '📧 Accès', value: 'Tu reçois un email avec ton accès TutorBird après ton appariement' },
      { name: '📊 Dashboard', value: 'Vue d\'ensemble de tes séances et élèves' },
      { name: '📅 Calendrier', value: 'Planification de tes séances' },
      { name: '📚 Ressources', value: 'Matériel pédagogique disponible' },
      { name: '💰 Paies', value: 'Suivi de tes paiements' },
    ],
    buttons: [
      { id: 'btn_N2_v2_done', label: '🎥 Vidéo 2 vue', style: 'Primary' },
    ],
    nextStep: 'N2-05',
  },

  'N2-05': {
    id: 'N2-05',
    level: 2,
    type: 'quiz',
    title: 'Quiz — Outils (TutorBird)',
    description: 'Valide ta compréhension de TutorBird.',
    questions: [
      {
        q: 'À quoi sert TutorBird ?',
        options: [
          'Discuter avec les élèves',
          'Gérer les séances, suivis et paies',
          'Créer des devoirs auto-corrigés',
          'Postuler aux offres',
        ],
        correctIndex: 1,
      },
      {
        q: 'Quand reçois-tu l\'accès à TutorBird ?',
        options: [
          'Dès la fin de N1',
          'Après avoir été accepté à une offre',
          'Après 1 mois de tutorat',
          'Il faut en faire la demande',
        ],
        correctIndex: 1,
      },
      {
        q: 'Où vérifier tes paiements ?',
        options: [
          'Google Drive',
          'Section Paies dans TutorBird',
          'Message Discord',
          'Site web Centre Reed',
        ],
        correctIndex: 1,
      },
    ],
    passMessage: '✅ Parfait ! Passons aux séances.',
    failMessage: '❌ Revois la vidéo et réessaie.',
    onPass: {
      nextStep: 'N2-06', // Vidéo Séance Découverte
    },
    onFail: {
      retryStep: 'N2-04',
    },
  },

  'N2-06': {
    id: 'N2-06',
    level: 2,
    title: 'Vidéo 3 — Séance Découverte (Première séance)',
    description: 'Apprends à préparer et animer ta toute première séance avec ton élève.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: '📂 Panier de l\'élève', value: 'Accès au Drive contenant les documents de l\'élève (notes, devoirs, etc.)' },
      { name: '📋 Fiche de Levin', value: 'Outil d\'évaluation du style et des forces d\'apprentissage de l\'élève' },
      { name: '🎯 Évaluation initiale', value: 'Identifier les besoins et le niveau actuel de l\'élève' },
      { name: '🔗 Démarrer', value: 'Créer le lien avec l\'élève et établir un climat de confiance' },
    ],
    buttons: [
      { id: 'btn_N2_v3_done', label: '🎥 Vidéo 3 vue', style: 'Primary' },
    ],
    nextStep: 'N2-07',
  },

  'N2-07': {
    id: 'N2-07',
    level: 2,
    type: 'quiz',
    title: 'Quiz — Séance Découverte',
    description: 'Vérifie ta compréhension de la préparation de la première séance.',
    questions: [
      {
        q: 'Avant la première séance, tu dois consulter :',
        options: [
          'Uniquement l\'email de confirmation',
          'Le panier de l\'élève et la fiche de Levin',
          'Les notes de l\'ancien tuteur',
          'Le bulletin de l\'école',
        ],
        correctIndex: 1,
      },
      {
        q: 'La fiche de Levin sert à :',
        options: [
          'Calculer les notes de l\'élève',
          'Évaluer le style et les forces d\'apprentissage',
          'Planifier les vacances',
          'Corriger les exercices',
        ],
        correctIndex: 1,
      },
      {
        q: 'L\'objectif principal de la séance découverte est de :',
        options: [
          'Finir tous les devoirs en retard',
          'Créer le lien et évaluer les besoins de l\'élève',
          'Enseigner toute la matière manquée',
          'Parler uniquement avec le parent',
        ],
        correctIndex: 1,
      },
    ],
    passMessage: '✅ Excellent ! Passons aux séances récurrentes.',
    failMessage: '❌ Revois la vidéo et réessaie.',
    onPass: {
      nextStep: 'N2-08', // Vidéo Séances Récurrentes
    },
    onFail: {
      retryStep: 'N2-06',
    },
  },

  'N2-08': {
    id: 'N2-08',
    level: 2,
    title: 'Vidéo 4 — Séances Récurrentes',
    description: 'Découvre comment structurer tes séances régulières après la séance découverte.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: '✅ Présence', value: 'Confirmer la présence de l\'élève et noter dans TutorBird' },
      { name: '🔄 Rappel', value: 'Revoir la séance précédente et faire le lien' },
      { name: '📊 Mise à jour élève', value: 'Demander comment s\'est passée la semaine (école, devoirs, examens)' },
      { name: '📚 Adapter', value: 'Alterner entre théorie et exercices selon les besoins' },
      { name: '🎓 Teach-back', value: 'Faire expliquer les concepts par l\'élève pour valider la compréhension' },
      { name: '💬 Récap + Feedback', value: 'Résumer la séance et noter le feedback dans TutorBird' },
    ],
    buttons: [
      { id: 'btn_N2_v4_done', label: '🎥 Vidéo 4 vue', style: 'Primary' },
    ],
    nextStep: 'N2-09',
  },

  'N2-09': {
    id: 'N2-09',
    level: 2,
    type: 'quiz',
    title: 'Quiz — Séances Récurrentes',
    description: 'Valide ta compréhension du déroulement des séances.',
    questions: [
      {
        q: 'Au début de chaque séance, tu dois :',
        options: [
          'Commencer directement les exercices',
          'Confirmer la présence et faire un rappel de la séance précédente',
          'Parler uniquement de la nouvelle matière',
          'Donner un examen surprise',
        ],
        correctIndex: 1,
      },
      {
        q: 'Le "teach-back" consiste à :',
        options: [
          'Répéter la matière plusieurs fois',
          'Faire expliquer les concepts par l\'élève',
          'Donner des devoirs supplémentaires',
          'Regarder des vidéos YouTube',
        ],
        correctIndex: 1,
      },
      {
        q: 'En fin de séance, tu dois :',
        options: [
          'Partir immédiatement',
          'Faire un récap et noter le feedback dans TutorBird',
          'Attendre que le parent arrive',
          'Donner un examen',
        ],
        correctIndex: 1,
      },
    ],
    passMessage: '🎉 **Formation complète réussie !**',
    failMessage: '❌ Revois la vidéo et réessaie.',
    onPass: {
      nextStep: 'N2-10',
    },
    onFail: {
      retryStep: 'N2-08',
    },
  },

  'N2-10': {
    id: 'N2-10',
    level: 2,
    type: 'completion',
    title: '🏆 Toutes nos félicitations !',
    description: 'Tu as terminé l\'intégralité de la formation Centre Reed !',
    fields: [
      { name: '✅ Tu as appris', value: '• La méthode pédagogique Centre Reed\n• Utiliser TutorBird\n• Préparer et animer une séance découverte\n• Structurer tes séances récurrentes' },
      { name: '🎁 Récompense finale', value: 'Tu viens de recevoir le rôle **Tuteur - Niveau 2 (Actif)** !' },
      { name: '🔓 Accès débloqué', value: 'Tu as maintenant accès aux canaux :\n• **#annonce** - Annonces importantes\n• **#formation** - Formation continue' },
      { name: '💙 Bienvenue', value: 'Tu fais maintenant officiellement partie de l\'équipe Centre Reed. Bon tutorat !' },
    ],
    buttons: [
      { id: 'btn_N2_complete', label: '🎉 Terminer la formation', style: 'Success' },
    ],
    onSuccess: {
      nextStep: null,
      addRoles: ['tuteurN2'],
      message: '🎉 **Tu es maintenant Tuteur - Niveau 2 (Actif) !**\n\n🔓 Accès débloqué :\n• <#' + config.channels.annonce + '>\n• <#' + config.channels.formation + '>\n\n**Tu es prêt à enseigner avec toute la rigueur Reed !** 💙\n\nBienvenue dans l\'équipe ! 🎓',
    },
  },
};
