# 🎓 Centre Reed - Discord Onboarding & Shifts Bot

Bot Discord complet pour l'onboarding des tuteurs et la gestion des contrats de tutorat.

## 📋 Fonctionnalités

### 🎯 Système d'Onboarding (2 niveaux)

**Formation Niveau 1** (`/start_onboarding`)
- Vidéo : Processus d'appariement & bidding
- Quiz de validation
- Test pratique de candidature
- → Obtenir le rôle **Tuteur - Niveau 1**
- → Accès au canal #appliquer-à-un-contrat

**Formation Niveau 2** (`/finish_onboarding`)  
- Réservé aux tuteurs avec rôle **N1A (Apparié)**
- 3 vidéos : TutorBird, Premières séances, FAQ
- 3 quiz de validation
- → Obtenir le rôle **Tuteur - Niveau 2 (Actif)**
- → Accès au canal #équipe

### 📋 Système de Gestion des Contrats

**Pour les admins :**
- `/shift post` - Publier un nouveau contrat
- `/shift applicants <id>` - Voir les candidats
- `/shift assign <id> @user` - Assigner un tuteur (attribution auto du rôle N1A)
- `/shift unassign <id>` - Retirer l'assignation
- `/shift close <id>` - Fermer aux candidatures

**Pour les tuteurs :**
- Boutons "Postuler" / "Retirer" sur chaque contrat
- `/shift my` - Voir mes contrats actifs

**Automatisations :**
- Attribution automatique du rôle **N1A (Apparié)** lors de l'assignation d'un tuteur N1
- Création de threads privés pour chaque contrat assigné
- Stockage dans Firestore

---

## 🚀 Installation & Configuration

### Prérequis
- Node.js v16+
- Un bot Discord avec permissions Administrator
- Firebase/Firestore (pour le système de shifts)

### Installation

```bash
# 1. Cloner et installer
git clone <repo>
cd Reed_Discord_bot
npm install

# 2. Configuration
# Créer .env avec vos credentials Discord
# Voir SETUP_FIREBASE.md pour configurer Firebase

# 3. Enregistrer les commandes
node register-commands.js

# 4. Lancer le bot
node index.js
```

---

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# Discord
DISCORD_TOKEN=votre_token
CLIENT_ID=votre_client_id
GUILD_ID=votre_guild_id

# Canaux
CHANNEL_ONBOARDING=id_canal_onboarding
CHANNEL_CONTRATS=id_canal_appliquer_contrat
CHANNEL_EQUIPE=id_canal_equipe

# Rôles
ROLE_CANDIDAT=id_role_candidat
ROLE_TUTEUR_N1=id_role_tuteur_n1
ROLE_TUTEUR_N1A=id_role_tuteur_n1a
ROLE_TUTEUR_N2=id_role_tuteur_n2

# Firebase (pour shifts)
GOOGLE_APPLICATION_CREDENTIALS=/chemin/vers/service-account.json
```

### Permissions Discord Requises

Le bot doit avoir :
- ✅ Administrator (ou Manage Roles + Manage Threads)
- ✅ Son rôle au-dessus des rôles N1, N1A, N2
- ✅ Accès aux canaux #onboarding, #appliquer-à-un-contrat, #équipe

---

## 📁 Structure du Projet

```
Reed_Discord_bot/
├── index.js                 # Bot principal
├── config.js               # Configuration (charge .env)
├── onboardingFlow.js       # Définition des étapes de formation
├── progressManager.js      # Gestion progression utilisateurs
├── firebase.js             # Configuration Firebase
├── shiftStore.js           # DAO Firestore pour shifts
├── shiftModule.js          # Logique commandes /shift
├── register-commands.js    # Enregistrement commandes slash
├── progress.json           # Base de données locale (auto-créé)
├── service-account.json    # Clé Firebase (à créer)
└── .env                    # Variables d'environnement
```

---

## 🎮 Utilisation

### Pour les Admins

**Onboarding :**
- `!progress @user` - Voir la progression d'un utilisateur
- `!reset @user` - Réinitialiser la progression
- `!reset_roles @user` - Retirer tous les rôles d'onboarding
- `!help` - Afficher l'aide

**Shifts :**
- `/shift post` - Publier un contrat
- `/shift applicants <id>` - Voir candidats
- `/shift assign <id> @user` - Assigner
- `/shift unassign <id>` - Désassigner
- `/shift close <id>` - Fermer

### Pour les Tuteurs

**Onboarding :**
1. Dans #onboarding : `/start_onboarding`
2. Compléter la formation N1
3. Postuler aux contrats dans #appliquer-à-un-contrat
4. Une fois apparié (N1A) : `/finish_onboarding`
5. Compléter la formation N2

**Shifts :**
- Cliquer "✅ Postuler" sur un contrat
- `/shift my` pour voir ses contrats

---

## 📚 Documentation

- **`GUIDE_SHIFTS.md`** - Guide complet du système de shifts
- **`SETUP_FIREBASE.md`** - Configuration Firebase étape par étape
- **`onboardingFlow.js`** - Détails de chaque étape de formation

---

## 🔄 Flow Complet

```
1. Nouveau Tuteur
   ↓
2. /start_onboarding → Formation N1 → Rôle N1
   ↓
3. Postule aux contrats (#appliquer-à-un-contrat)
   ↓
4. Admin assigne → Rôle N1A (Apparié)
   ↓
5. /finish_onboarding → Formation N2 → Rôle N2 (Actif)
   ↓
6. Accès #équipe → Tuteur actif ! 🎉
```

---

## 🆘 Dépannage

### Le bot ne répond pas
- Vérifier que le bot est en ligne
- Vérifier les logs console
- Vérifier que les commandes sont enregistrées

### Les rôles ne sont pas attribués
- Vérifier que le rôle du bot est au-dessus des rôles N1/N1A/N2
- Vérifier que le bot a la permission "Manage Roles"

### Firebase ne fonctionne pas
- Vérifier que `service-account.json` existe
- Vérifier le chemin dans `.env`
- Consulter `SETUP_FIREBASE.md`

### Thread privé non créé
- Vérifier permissions "Create Private Threads" et "Manage Threads"

---

## 💰 Coûts

**Firebase Firestore (gratuit) :**
- 1 GB stockage
- 50,000 lectures/jour
- 20,000 écritures/jour
- 20,000 suppressions/jour

→ **Largement suffisant pour un bot d'onboarding !** 🎉

---

## 📄 Licence

Propriété du Centre Reed - Usage interne uniquement.

---

## 🤝 Support

Pour toute question, contactez l'équipe technique du Centre Reed.

**Made with ❤️ for Reed Tutoring**
