// Définition complète du flow d'onboarding Centre Reed
const config = require('./config');

module.exports = {
  // ============================================
  // NIVEAU 1 - Discord et savoir comment appliquer
  // Commande: /start_onboarding
  // Résultat: Rôle Tuteur N1 → Accès #OFFRES
  // ============================================

  'N1-01': {
    id: 'N1-01',
    level: 1,
    title: '🎯 Bienvenue au Centre Reed - Formation Niveau 1',
    description: 'Bienvenue ! Tu vas maintenant apprendre à utiliser **Discord** et à **savoir comment appliquer** aux offres de tutorat.\n\n**Ce que tu vas accomplir :**\n• Découvrir le canal #OFFRES\n• Comprendre comment appliquer aux offres de tutorat et de mandat\n• Débloquer le rôle **Tuteur - niveau 1**',
    fields: [
      { name: '⏱️ Durée', value: '5-10 minutes' },
      { name: '🎯 Objectif', value: 'Obtenir le rôle **Tuteur - niveau 1** et accéder à #OFFRES' },
    ],
    buttons: [
      { id: 'btn_N1_start', label: '🚀 Commencer', style: 'Primary' },
    ],
    nextStep: 'N1-02',
  },

  'N1-02': {
    id: 'N1-02',
    level: 1,
    title: 'Vidéo 1 — Discord : savoir comment appliquer',
    description: 'Découvre comment naviguer dans Discord et comment appliquer aux offres de tutorat.',
    fields: [
      { name: 'Lien', value: '🎬 [Regarder la vidéo](https://youtu.be/ham62aTgKw0)' },
      { name: '📱 Canal #OFFRES', value: 'C\'est ici que les offres de tutorat et de mandat sont publiées' },
      { name: '✅ Comment appliquer', value: 'Clique sur le bouton "Postuler" sous chaque offre pour soumettre ta candidature' },
      { name: '⏱️ Durée des offres', value: 'Les offres restent ouvertes 24h, applique rapidement !' },
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
    title: 'Quiz — Discord et offres de tutorat',
    description: 'Teste tes connaissances sur le processus pour appliquer aux offres.',
    questions: [
      {
        q: 'Où appliques-tu aux offres de tutorat ?',
        options: [
          'Sur le site web Centre Reed',
          'Dans le canal #OFFRES sur Discord',
          'Par courriel à la direction',
          'Sur un formulaire externe',
        ],
        correctIndex: 1,
      },
      {
        q: 'Comment appliquer à une offre ?',
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
    title: '🎉 Formation Niveau 1 complétée !',
    description: 'Félicitations ! Tu as terminé la première étape de ta formation.',
    fields: [
      { name: '✅ Ce que tu as appris', value: '• Navigation Discord\n• Comment appliquer dans #OFFRES\n• Comprendre les offres de tutorat et de mandat' },
      { name: '🎁 Récompense', value: 'Tu viens de recevoir le rôle **Tuteur - niveau 1** !' },
      { name: '🔓 Accès débloqué', value: 'Tu peux maintenant voir et appliquer aux offres dans **#OFFRES**' },
      { name: '➡️ Prochaine étape', value: 'Une fois que tu seras **accepté à une offre**, tu recevras le rôle **Tuteur - niveau 1A**.\n\nTu pourras alors continuer ta formation complète avec `/finish_onboarding` !' },
    ],
    buttons: [
      { id: 'btn_N1_complete', label: '🎓 Terminer', style: 'Success' },
    ],
    onSuccess: {
      nextStep: null,
      addRoles: ['tuteurN1'],
      message: '🎉 **Tu es maintenant Tuteur - niveau 1 !**\n\n🔓 Accès débloqué : <#' + config.channels.contrats + '>\n\n**Prochaine étape :** Applique à une offre et attends d\'être accepté pour continuer ta formation ! 💙',
    },
  },

  // ============================================
  // NIVEAU 2 - Formation complète (N1A → N2)
  // Commande: /finish_onboarding (requiert rôle N1A)
  // Résultat: Rôle Tuteur N2 → Accès #OFFRES + Formation continue
  // ============================================

  'N2-01': {
    id: 'N2-01',
    level: 2,
    title: '🎉 Félicitations pour ton appariement !',
    description: 'Bravo ! Tu as été accepté à une offre et tu es maintenant **Tuteur - niveau 1A**.\n\n**Ce que tu vas apprendre :**\n• La Méthode Reed\n• Utiliser nos principaux outils et ressources numériques\n• Comment se réalisent la Séance Découverte et les Séances récurrentes',
    fields: [
      { name: '⏱️ Durée', value: '1h20' },
      { name: '🎯 Objectif', value: 'Devenir un tuteur certifié au sein du Centre Reed (N2 Actif)' },
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
    description: 'Découvre notre approche pédagogique et notre philosophie au sein du centre.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: 'Notre vision', value: 'Comprendre la mission du Centre Reed et la finalité de notre accompagnement.' },
      { name: 'Tuteur exemplaire', value: 'Adopter la posture attendue d\'un tuteur Reed dans sa relation avec l\'élève.' },
      { name: 'Méthodes pédagogiques détaillées', value: 'Explorer les principes qui guident la méthode Reed durant les séances.' },
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
    title: 'Quiz — Formation 1 : La méthode Reed',
    description: 'Valide ta compréhension de la méthode Reed.',
    questions: [
      {
        q: 'Quel est l’objectif principal du Centre Reed dans l’accompagnement des élèves ?',
        options: [
          'Rendre l’élève autonome dans son apprentissage',
          'Améliorer les notes rapidement',
          'Compléter les devoirs le plus vite possible',
          'Préparer uniquement les examens',
        ],
        correctIndex: 0,
      },
      {
        q: 'Selon la vision du Centre Reed, quel est l’objectif à long terme ?',
        options: [
          'Augmenter la motivation scolaire',
          'Développer les fonctions exécutives',
          'Réussir les examens finaux',
          'Compléter les devoirs sans aide',
        ],
        correctIndex: 1,
      },
      {
        q: 'Quel élément est considéré comme la clé #1 de la réussite d’un élève ?',
        options: [
          'Le matériel pédagogique utilisé',
          'Le nombre d’heures de tutorat',
          'La relation de confiance avec le tuteur',
          'La difficulté des exercices',
        ],
        correctIndex: 2,
      },
      {
        q: 'Dans le dialogue socratique, quel est le rôle principal du tuteur ?',
        options: [
          'Donner directement la réponse à l’élève',
          'Expliquer toute la matière avant les exercices',
          'Corriger immédiatement chaque erreur',
          'Poser des questions pour stimuler la réflexion de l’élève',
        ],
        correctIndex: 3,
      },
      {
        q: 'Dans la méthode de classe inversée utilisée au Centre Reed, quel est le rôle principal de l’élève durant la séance de tutorat ?',
        options: [
          'Écouter les explications du tuteur avant de faire les exercices',
          'Réviser la matière et répondre aux questions du tuteur',
          'Observer les méthodes du tuteur pour les reproduire plus tard',
          'Expliquer dans ses propres mots ce qu’il a compris de la matière déjà vue et appliquer les concepts',
        ],
        correctIndex: 3,
      },
    ],
    passMessage: '✅ Bonne compréhension de la méthode Reed.',
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
    title: 'Vidéo 2 — Outils et ressources',
    description: 'Apprends à utiliser nos principaux outils et ressources numériques pour tes séances.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: 'TutorBird', value: 'Plateforme de collaboration et gestion avec les élèves et le Centre.' },
      { name: 'Google Meets', value: 'Application où se déroulent les séances.' },
      { name: 'Canva/Miro', value: 'Outils gratuits avec tableau blanc et autres ressources.' },
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
    title: 'Quiz — Formation 2 : Outils et plateformes',
    description: 'Valide ta compréhension des outils et plateformes.',
    questions: [
      {
        q: 'Dans TutorBird, que devez-vous faire lorsque la séance a eu lieu normalement ?',
        options: [
          'Sélectionner Présent dans les présences',
          'Ajouter un commentaire dans les détails de la leçon',
          'Modifier le statut dans le calendrier',
          'Envoyer une confirmation à l’administration',
        ],
        correctIndex: 0,
      },
      {
        q: 'Si un élève est absent à une séance, que devez-vous faire dans TutorBird ?',
        options: [
          'Marquer l’élève comme absent dans les présences',
          'Reporter la séance dans le calendrier',
          'Ne rien modifier, les absences sont gérées par l’administration',
          'Supprimer la séance',
        ],
        correctIndex: 2,
      },
      {
        q: 'Où pouvez-vous consulter les informations concernant votre paie dans TutorBird ?',
        options: [
          'Accueil → Présences',
          'Votre nom (en haut à droite) → Profil → Paie',
          'Calendrier → Historique des séances',
          'Ressources en ligne → Votre dossier',
        ],
        correctIndex: 1,
      },
      {
        q: 'À quoi sert principalement le chat dans Google Meet durant une séance ?',
        options: [
          'Remplacer complètement la communication orale',
          'Partager des liens ou des informations pendant la séance',
          'Enregistrer automatiquement la séance',
          'Vérifier la présence de l’élève',
        ],
        correctIndex: 1,
      },
      {
        q: 'Lorsque vous utilisez un tableau blanc collaboratif (comme Canva ou Miro), quelle option devez-vous choisir pour permettre à l’élève d’y accéder facilement ?',
        options: [
          'Partager le tableau en mode lecture seulement',
          'Envoyer une capture d’écran du tableau',
          'Choisir l’accès n’importe qui avec le lien et envoyer le lien dans le chat',
          'Télécharger le tableau en PDF et l’envoyer à l’élève',
        ],
        correctIndex: 2,
      },
    ],
    passMessage: '✅ Parfait ! Passons à la Séance Découverte.',
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
    title: 'Vidéo 3 — Séance Découverte (première séance)',
    description: 'Apprends à préparer et animer ta toute première séance avec ton élève.',
    fields: [
      { name: 'Lien', value: '🎬 *[Vidéo à venir]*' },
      { name: 'Document Séance Découverte', value: 'Guide principal pour structurer la première rencontre avec l’élève.' },
      { name: 'Tableau des ressources', value: 'Repère les outils et documents utiles à préparer avant la séance.' },
      { name: 'Outil E-Reed', value: 'Mesure les techniques d’étude et les fonctions exécutives de l’élève.' },
      { name: 'Rétroaction - Séance Découverte', value: 'Permet de transmettre les observations importantes après la première séance.' },
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
    title: 'Quiz — Formation 3 : Séance Découverte',
    description: 'Valide ta compréhension de la première séance.',
    questions: [
      {
        q: 'Quel est l’un des principaux objectifs de la séance découverte ?',
        options: [
          'Compléter tous les devoirs de l’élève',
          'Établir un premier lien de contact avec l’élève',
          'Enseigner un nouveau chapitre',
          'Donner un examen diagnostique',
        ],
        correctIndex: 1,
      },
      {
        q: 'Quelle est la durée approximative d’une séance découverte ?',
        options: [
          '30 minutes pour tous',
          '1 heure pour primaire et 1h30 pour secondaire',
          '2 heures pour tous',
          '45 minutes seulement',
        ],
        correctIndex: 1,
      },
      {
        q: 'Quel document sert de guide pour structurer la première rencontre avec l’élève ?',
        options: [
          'Le document Séance Découverte',
          'Le dossier Programme',
          'Le rapport Rétroaction',
          'Le dossier Matériel didactique',
        ],
        correctIndex: 0,
      },
      {
        q: 'L’outil E-Reed sert principalement à :',
        options: [
          'Évaluer les devoirs de mathématiques',
          'Corriger les examens',
          'Mesurer les techniques d’étude et les fonctions exécutives',
          'Créer le programme de tutorat',
        ],
        correctIndex: 2,
      },
      {
        q: 'Durant la séance découverte, que devrait prioriser le tuteur après l’utilisation des outils ?',
        options: [
          'Enseigner une nouvelle matière',
          'Faire un résumé théorique',
          'Donner un test écrit',
          'Évaluer les capacités académiques à travers les devoirs',
        ],
        correctIndex: 3,
      },
    ],
    passMessage: '✅ Excellent ! Passons aux séances récurrentes.',
    failMessage: '❌ Revois la vidéo et réessaie.',
    onPass: {
      nextStep: 'N2-08',
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
      { name: 'Dossier Programme', value: 'Définit les objectifs et les besoins de l’élève pour les prochaines séances.' },
      { name: 'Dossier Rétroaction', value: 'Centralise les retours utiles au suivi de l’élève.' },
      { name: 'Dossier Matériel didactique Reed', value: 'Regroupe le matériel pédagogique et les fiches de stratégies Reed.' },
      { name: 'Compte-rendu', value: 'Structure la trace de séance, notamment avec la méthode 5P et 5D.' },
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
    title: 'Quiz — Formation 4 : Séances récurrentes',
    description: 'Valide ta compréhension des séances récurrentes.',
    questions: [
      {
        q: 'Quand les séances récurrentes commencent-elles généralement ?',
        options: [
          'Avant la séance découverte',
          'Après la séance découverte',
          'Après 5 séances',
          'Après un examen',
        ],
        correctIndex: 1,
      },
      {
        q: 'Dans les séances récurrentes, à quoi sert principalement le document Programme contenu dans le dossier Programme ?',
        options: [
          'À établir les objectifs et les besoins de l’élève pour les 10 prochaines séances',
          'À conserver les devoirs complétés par l’élève',
          'À noter les commentaires des parents',
          'À enregistrer les horaires des séances',
        ],
        correctIndex: 0,
      },
      {
        q: 'Le dossier Rétroaction est principalement utilisé par :',
        options: [
          'Les élèves',
          'Les parents',
          'Les administrateurs',
          'Les tuteurs',
        ],
        correctIndex: 2,
      },
      {
        q: 'Que contient le dossier Matériel didactique Reed ?',
        options: [
          'Les notes scolaires de l’élève',
          'Les factures des séances',
          'Les exercices d’examens',
          'Le matériel pédagogique et les fiches de stratégies',
        ],
        correctIndex: 3,
      },
      {
        q: 'Que signifie la méthode 5P et 5D dans le compte-rendu des séances ?',
        options: [
          'Les cinq progrès et cinq difficultés de l’élève',
          'Les cinq objectifs et cinq résultats de la séance',
          'Les questions posées dans les cinq premières et les cinq dernières minutes de la séance',
          'Les cinq devoirs et cinq exercices supplémentaires',
        ],
        correctIndex: 2,
      },
    ],
    passMessage: '🎉 Formation terminée !',
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
    title: '🎓 Formation terminée',
    description: 'Tu as terminé l’intégralité de la formation Centre Reed.',
    fields: [
      { name: '✅ Tu as appris', value: '• La méthode pédagogique Reed\n• Comment utiliser nos principaux outils et ressources numériques\n• Préparer ta Séance Découverte (première séance)\n• Structurer tes séances récurrentes' },
      { name: '🎁 Récompense finale', value: 'Tu viens de recevoir le rôle **Tuteur - niveau 2** !' },
      { name: '🔓 Accès débloqué', value: 'Tu as maintenant accès à :\n• **#OFFRES**\n• **Formation continue**' },
      { name: '💙 Certification', value: 'Tu es maintenant un tuteur certifié au sein du Centre Reed (N2 Actif).' },
    ],
    buttons: [
      { id: 'btn_N2_complete', label: '🎉 Terminer la formation', style: 'Success' },
    ],
    onSuccess: {
      nextStep: null,
      addRoles: ['tuteurN2'],
      message: '🎉 **Formation terminée !**\n\nTu es maintenant **Tuteur - niveau 2**.\n\n🔓 Accès débloqué :\n• <#' + config.channels.contrats + '>\n• <#' + config.channels.formation + '>\n\n**Tu es prêt à enseigner avec la méthode Reed.** 💙',
    },
  },
};
