// Définition complète du flow d'onboarding Centre Reed
const config = require('./config');

module.exports = {
  // Niveau 1 - Processus & Bidding
  'N1-01': {
    id: 'N1-01',
    level: 1,
    title: '🎯 Bienvenue au Centre Reed - Formation Niveau 1',
    description: 'Bienvenue ! Tu vas maintenant apprendre comment **postuler aux offres d\'élèves** et débloquer l\'accès au canal **#appliquer-à-un-contrat**.\n\n**Ce que tu vas accomplir :**\n• Comprendre le processus d\'appariement\n• Apprendre à postuler (bidding)\n• Réussir un test pratique\n• Débloquer le rôle **Tuteur - Niveau 1**',
    buttons: [
      { id: 'btn_N1_start', label: '🚀 Commencer', style: 'Primary' },
    ],
    nextStep: 'N1-02',
  },

  'N1-02': {
    id: 'N1-02',
    level: 1,
    title: 'Vidéo 1 — Processus d\'appariement & postulation (5–10 min)',
    description: 'Découvre comment les **offres d\'élèves** sont publiées sur Discord et comment **postuler (bidding)**.',
    fields: [
      { name: 'Lien', value: '🎬 [Regarder la vidéo](https://youtu.be/ham62aTgKw0)' },
      { name: 'Durée', value: '5–10 minutes' },
      { name: 'À retenir', value: 'Chaque offre reste **ouverte 24h** ; tu **postules en cliquant sur le bouton "Postuler"** sous l\'offre.' },
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
    title: 'Quiz — Appariement & Bidding',
    description: 'Teste tes connaissances sur le processus d\'appariement.',
    questions: [
      {
        q: "Combien de temps une offre d'appariement reste-t-elle ouverte ?",
        options: ['12 heures', '24 heures', '48 heures', "Jusqu'à ce qu'un tuteur se propose"],
        correctIndex: 1,
      },
      {
        q: "Que doit contenir la fiche d'offre ?",
        options: [
          'Nom du parent et téléphone',
          'Matière, niveau, heures et disponibilités',
          "Nombre d'élèves par classe",
          "Salaire d'autres tuteurs",
        ],
        correctIndex: 1,
      },
      {
        q: 'Comment postuler (bidder) ?',
        options: [
          'Envoyer un courriel à la direction',
          'Cliquer sur le bouton "Postuler" sous l\'offre',
          'Répondre dans le thread Discord avec une courte présentation',
          'Remplir un formulaire externe',
        ],
        correctIndex: 1,
      },
    ],
    passMessage: '✅ Parfait. Passons au test pratique (offre fictive).',
    failMessage: '❌ Mauvaises réponses. Revois la vidéo et réessaie.',
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
    type: 'practice',
    title: 'Test — Comprendre une offre (fictive)',
    description: 'Voici une **offre fictive**. Lis attentivement les détails pour comprendre comment analyser une offre avant de postuler.',
    fields: [
      {
        name: 'Offre Exemple',
        value: '📣 **Math Sec 2**\n\n📅 Date de début: 2025-11-12\n⏱️ Durée: 2h/semaine pendant 4 semaines\n🗓️ Disponibilités élève: Lun 18-19h, Jeu 17-18h\n📚 Matières: Mathématiques (fractions & équations)',
      },
      {
        name: '💡 Comment postuler ?',
        value: 'Quand tu verras une vraie offre dans **#appliquer-à-un-contrat**, tu devras :\n\n1️⃣ **Lire attentivement** les détails de l\'offre\n2️⃣ **Vérifier** que tu es disponible aux heures indiquées\n3️⃣ **Cliquer sur le bouton "Postuler"** sous l\'offre\n\n✅ C\'est aussi simple que ça ! Les admins verront ta candidature.',
      },
    ],
    footer: 'Clique ci-dessous pour confirmer que tu as compris le processus.',
    buttons: [
      { id: 'btn_N1_practice_done', label: '✅ J\'ai compris le processus', style: 'Primary' },
    ],
    onSuccess: {
      nextStep: null,
      addRoles: ['tuteurN1'],
      message: '🎉 **Formation Niveau 1 complétée !**\n\nTu as maintenant le rôle **Tuteur - Niveau 1**.\n\n🔓 Tu peux maintenant voir et postuler aux offres dans le canal **#appliquer-à-un-contrat** !\n\n**Prochaine étape :** Une fois que tu seras accepté à une offre et que tu recevras le rôle **Tuteur - Apparié (N1A)**, tape `/finish_onboarding` pour faire la **Formation Niveau 2** et devenir tuteur actif ! 🎓',
    },
  },

  // Niveau 2 - TutorBird & Séances (Accessible seulement avec le rôle Tuteur - Apparié)
  'N2-01': {
    id: 'N2-01',
    level: 2,
    title: '🎓 Bienvenue à la Formation Niveau 2',
    description: 'Félicitations pour ton appariement ! 🎉\n\nCette formation te préparera à donner tes premières séances et à utiliser TutorBird.\n\n**Ce que tu vas apprendre :**\n• Utiliser TutorBird (plateforme de gestion)\n• Préparer et animer tes premières séances\n• Bonnes pratiques et FAQ',
    fields: [
      { name: '⏱️ Durée', value: '20-30 minutes' },
      { name: '🎯 Objectif', value: 'Obtenir le rôle **Tuteur N2 (Actif)** et accéder à #équipe' },
    ],
    footer: 'Clique pour continuer vers la première vidéo.',
    buttons: [
      { id: 'btn_N2_start', label: '▶️ Commencer', style: 'Primary' },
    ],
    nextStep: 'N2-02',
  },

  'N2-02': {
    id: 'N2-02',
    level: 2,
    title: 'Vidéo 1 — Après acceptation d\'une offre',
    description: 'Découvre les **emails de confirmation** envoyés au parent et au tuteur, puis l\'**accès à TutorBird**.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: 'Contenu du courriel', value: 'Date de début, nb d\'heures/semaine, jours/heures fixes, matière, niveau, infos importantes.' },
      { name: 'Étape suivante', value: 'Tu reçois un **second email** avec **ton accès à TutorBird**.' },
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
    title: 'Quiz — Email de confirmation & Accès TutorBird',
    description: 'Vérifie ta compréhension du processus post-acceptation.',
    questions: [
      {
        q: "Que contient l'email de confirmation ?",
        options: [
          'Lien Google Classroom',
          "Horaires, matières, nb d'heures et infos importantes",
          "Notes de l'élève",
          "Contrat d'emploi complet",
        ],
        correctIndex: 1,
      },
      {
        q: 'Quel email reçois-tu ensuite ?',
        options: ['Rappel des valeurs', 'Accès à TutorBird', 'Message du parent', "Sondage d'opinion"],
        correctIndex: 1,
      },
      {
        q: 'TutorBird sert à :',
        options: [
          "Discuter avec l'élève",
          'Gérer séances, suivis et paies',
          'Créer des devoirs auto-corrigés',
          'Gérer les inscriptions',
        ],
        correctIndex: 1,
      },
    ],
    passMessage: '✅ Parfait. Passons à **TutorBird & premières séances**.',
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
    title: 'Vidéo 2 — TutorBird & Premières séances (7–9 min)',
    description: 'Présentation du **Dashboard**, **Calendrier**, **Ressources**, **Paies**, **Feedback**. Puis : **première séance** (panier élève, outil de Levin, documents) et **séances suivantes** (présence, lien avec séances précédentes, théorie vs exercices, recap & feedback).',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: 'Première séance', value: '1) Panier de l\'élève (Drive)\n2) Outil de Levin\n3) Évaluation initiale\n4) Démarrer en créant le lien' },
      { name: 'Séances suivantes', value: 'Présence • Rappel • Mise à jour élève • Évaluation rapide • Adapter (théorie/exos) • Teach-back • Récap + feedback' },
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
    title: 'Quiz — Première séance & Séances suivantes',
    description: 'Valide ta compréhension des bonnes pratiques de séance.',
    questions: [
      {
        q: 'Avant la première séance, tu dois :',
        options: [
          "Appeler l'élève directement",
          "Consulter le panier et l'outil de Levin",
          'Envoyer des exercices',
          'Remplir le rapport de séance',
        ],
        correctIndex: 1,
      },
      {
        q: "L'outil de Levin sert à :",
        options: [
          'Calculer les notes',
          "Évaluer le style & forces d'apprentissage",
          'Planifier les vacances',
          'Corriger les exos',
        ],
        correctIndex: 1,
      },
      {
        q: 'En fin de séance, tu dois :',
        options: ['Rien faire', 'Récap + feedback TutorBird', 'Attendre le parent', 'Refaire toute la séance'],
        correctIndex: 1,
      },
    ],
    passMessage: '✅ Super. Il reste la **FAQ & Bonnes pratiques**.',
    failMessage: '❌ Revois la vidéo et réessaie.',
    onPass: {
      nextStep: 'N2-06',
    },
    onFail: {
      retryStep: 'N2-04',
    },
  },

  'N2-06': {
    id: 'N2-06',
    level: 2,
    title: 'Vidéo 3 — FAQ & Bonnes pratiques (5–7 min)',
    description: 'Questions fréquentes : **changements/annulations (24h)**, **paies (TutorBird)**, **communication (canal support Discord / superviseur)**. Rappels de professionnalisme.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: 'Annulations', value: 'Préavis **24h**' },
      { name: 'Paies', value: 'Section **Paies** dans TutorBird' },
      { name: "Besoin d'aide ?", value: 'Écris dans **#support** ou contacte ton **superviseur académique**' },
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
    title: 'Quiz — FAQ & Bonnes pratiques',
    description: 'Dernier quiz pour valider ta formation complète !',
    questions: [
      {
        q: "Quel est le délai minimum d'annulation/déplacement ?",
        options: ['6h', '12h', '24h', '48h'],
        correctIndex: 2,
      },
      {
        q: 'Où vérifier tes paiements ?',
        options: ['Google Drive', 'TutorBird', 'Message Discord', 'Site Centre Reed'],
        correctIndex: 1,
      },
      {
        q: 'Question/problème — que faire ?',
        options: [
          'Attendre la fin du mois',
          'Contacter un collègue',
          'Écrire dans le canal support ou au superviseur académique',
          'Appeler le parent',
        ],
        correctIndex: 2,
      },
    ],
    passMessage: '🏅 **Niveau 2 complété !**',
    failMessage: '❌ Revois la vidéo et réessaie.',
    onPass: {
      nextStep: null,
      addRoles: ['tuteurN2'],
      message: '🎉 **Formation Niveau 2 complétée !**\n\nTu es maintenant **Tuteur - Niveau 2 (Actif)** ! 🎓\n\n🔓 Tu as maintenant accès au canal **#équipe** pour communiquer avec l\'équipe.\n\nTu es prêt à enseigner avec toute la rigueur Reed ! Bon tutorat ! 💙',
    },
    onFail: {
      retryStep: 'N2-06',
    },
  },
};
