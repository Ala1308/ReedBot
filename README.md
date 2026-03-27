# Centre Reed Discord Bot

Bot Discord interne pour Centre Reed qui automatise deux opérations clés :
- la montée en compétence des tuteurs via un onboarding structuré
- la gestion des offres de tutorat, des candidatures et des assignations

Ce README a deux objectifs :
- expliquer aux développeurs comment le projet est organisé et comment le faire tourner
- documenter, pour l'équipe Centre Reed, la valeur concrète apportée par le bot et les problèmes opérationnels qu'il résout

---

## Pourquoi ce bot existe

Avant ce type d'automatisation, plusieurs tâches reposent souvent sur des manipulations manuelles :
- expliquer plusieurs fois les mêmes consignes aux nouveaux tuteurs
- suivre manuellement qui a terminé quelle partie de la formation
- attribuer des rôles Discord à la main
- publier des offres sans structure commune
- retrouver difficilement qui a postulé, qui a été assigné, et quand
- exécuter des commandes admin visibles dans des salons publics

Ce bot a été construit pour réduire cette charge opérationnelle et rendre le processus plus fiable.

---

## Ce que le bot règle pour la compagnie

### 1. Standardiser l'onboarding

Le bot impose un parcours cohérent pour tous les tuteurs :
- même contenu
- même ordre de progression
- mêmes quiz
- mêmes critères de validation

Résultat :
- moins d'ambiguïté
- moins de dépendance à une explication humaine répétée
- meilleure uniformité dans la qualité de préparation des tuteurs

### 2. Réduire les erreurs administratives

Le bot automatise plusieurs points sensibles :
- suivi de progression
- attribution de rôles
- passage de `N1` à `N1A` lors d'une assignation
- accès débloqués au bon moment

Résultat :
- moins d'oublis
- moins d'erreurs de rôles
- moins de gestion ad hoc dans Discord

### 3. Structurer la gestion des offres

Les offres sont publiées avec un format homogène et un identifiant unique.

Résultat :
- lecture plus claire pour les tuteurs
- suivi plus simple pour les admins
- meilleure traçabilité des assignations

### 4. Donner de la visibilité aux admins

Le système `/shift` et `/admin` permet de :
- voir les candidats
- assigner ou désassigner un tuteur
- filtrer les contrats gérés
- consulter la progression d'un utilisateur

Résultat :
- meilleure capacité de pilotage
- moins de temps perdu à fouiller Discord manuellement

### 5. Rendre les actions admin plus discrètes et professionnelles

Les commandes admin ont été migrées vers des slash commands privées.

Résultat :
- les actions de gestion ne polluent plus les salons publics
- la confidentialité opérationnelle est meilleure
- l'expérience Discord est plus propre pour les tuteurs

---

## Fonctionnalités actuelles

### Onboarding tuteur

Le bot gère un parcours en 2 temps :

#### `N1` via `/start_onboarding`
- introduction à Discord
- savoir comment appliquer aux offres
- quiz de validation
- attribution du rôle `Tuteur - niveau 1`

#### Formation complète via `/finish_onboarding`
- réservée aux tuteurs déjà appariés (`N1A`)
- 4 vidéos
- 4 quiz
- passage final au rôle `Tuteur - niveau 2`

Thèmes de la formation complète :
- Méthode Reed
- Outils et ressources
- Séance Découverte
- Séances Récurrentes

### Accès débloqués par niveau

| Niveau | Comment il est obtenu | Rôle attribué | Accès débloqués |
|--------|------------------------|---------------|-----------------|
| `Niveau 1` | Après réussite de `/start_onboarding` | `Tuteur - niveau 1` | `#OFFRES` |
| `Niveau 1A` | Lorsqu’un admin assigne un contrat avec `/shift assign` | `Tuteur - niveau 1A` | accès à `/finish_onboarding` pour compléter la formation avancée |
| `Niveau 2` | Après réussite de `/finish_onboarding` | `Tuteur - niveau 2` | `#OFFRES`, `#ANNONCES`, `Formations continues` |

### Gestion des offres de tutorat

Le bot permet aux admins de :
- publier une offre
- voir les candidats
- assigner un tuteur
- retirer une assignation
- fermer une offre
- filtrer les contrats qu'ils gèrent

Le bot permet aux tuteurs de :
- postuler à une offre
- retirer leur candidature

### Commandes admin privées

Les admins peuvent maintenant utiliser :
- `/admin progress`
- `/admin reset`
- `/admin reset_roles`

Ces réponses sont envoyées de façon privée plutôt qu'en public dans les salons.

---

## Commandes principales

### Côté tuteur

- `/start_onboarding`
- `/finish_onboarding`
- boutons `Postuler` et `Retirer` sur les offres

### Côté admin

- `/shift post`
- `/shift applicants`
- `/shift assign`
- `/shift unassign`
- `/shift close`
- `/shift my`
- `/admin progress`
- `/admin reset`
- `/admin reset_roles`

Pour le détail opérationnel de ces commandes, voir `MANUEL_COMMANDES_ADMIN.md`.

---

## Nouveautés récemment ajoutées

Le projet a récemment évolué sur plusieurs points importants :

### Formation et quiz mis à jour

- nouveau contenu de formation complète
- 4 vidéos alignées sur le processus réel
- 4 quiz réécrits
- libellés Discord harmonisés
- rôles normalisés : `niveau 1`, `niveau 1A`, `niveau 2`

### Expérience quiz améliorée

- les réponses longues s'affichent maintenant dans l'embed
- les boutons sont courts et lisibles (`Réponse A`, `Réponse B`, etc.)

Cela évite que les réponses soient tronquées dans Discord.

### Accès et configuration Discord réalignés

- compatibilité avec `CHANNEL_OFFRES`
- compatibilité avec `CATEGORY_FORMATION`
- messages finaux alignés avec la structure actuelle du serveur

### Commandes admin modernisées

- suppression de la dépendance aux anciennes commandes texte publiques
- migration vers des slash commands admin privées
- sécurité renforcée sur les commandes `/shift`

### `/shift my` enrichi

La commande supporte maintenant des filtres comme :
- `status`
- `year`
- `subject`
- `published_after`
- `published_before`
- `limit`

Elle affiche aussi davantage de contexte :
- statut
- matières
- date de publication
- date d'assignation
- tuteur assigné

---

## Architecture du projet

### Fichiers principaux

```text
Reed_Discord_bot/
├── index.js
├── config.js
├── onboardingFlow.js
├── progressManager.js
├── adminModule.js
├── shiftModule.js
├── shiftStore.js
├── firebase.js
├── register-commands.js
├── progress.json
├── MANUEL_COMMANDES_ADMIN.md
└── README.md
```

### Rôle de chaque module

- `index.js`
  Point d'entrée du bot. Initialise le client Discord, enregistre les commandes et gère les interactions principales.

- `onboardingFlow.js`
  Source de vérité du contenu de formation : étapes, titres, descriptions, quiz, transitions et messages de fin.

- `progressManager.js`
  Gère la progression des utilisateurs et l'historique des quiz dans `progress.json`.

- `adminModule.js`
  Contient les commandes slash admin privées liées à la progression et aux rôles.

- `shiftModule.js`
  Contient les slash commands `/shift` et la logique métier associée.

- `shiftStore.js`
  Gère la persistance Firestore des offres, candidatures et assignations.

- `config.js`
  Charge les variables d'environnement et centralise les identifiants Discord.

- `register-commands.js`
  Permet de réenregistrer explicitement les slash commands si nécessaire.

---

## Stack technique

- Node.js
- `discord.js`
- `dotenv`
- `firebase-admin`
- Firestore pour les offres et assignations
- fichier JSON local pour la progression d'onboarding

---

## Installation

### Prérequis

- Node.js 16+ ou plus récent
- un bot Discord avec les permissions adaptées
- un projet Firebase configuré

### Installation locale

```bash
git clone <repo>
cd Reed_Discord_bot
npm install
```

### Scripts utiles

```bash
npm start
npm run register
```

Équivalent :

```bash
node index.js
node register-commands.js
```

---

## Configuration

### Variables d'environnement

Exemple de variables attendues :

```env
DISCORD_TOKEN=...
CLIENT_ID=...
GUILD_ID=...

CHANNEL_ONBOARDING=...
CHANNEL_OFFRES=...
CHANNEL_EQUIPE=...
CATEGORY_FORMATION=...

ROLE_CANDIDAT=...
ROLE_TUTEUR_N1=...
ROLE_TUTEUR_N1A=...
ROLE_TUTEUR_N2=...

GOOGLE_APPLICATION_CREDENTIALS=/chemin/vers/service-account.json
```

### Notes importantes

- `CHANNEL_OFFRES` est utilisé pour la publication des offres
- `CATEGORY_FORMATION` est utilisé pour la partie formation continue
- certains anciens noms de variables sont encore supportés en fallback pour compatibilité

---

## Flux métier résumé

```text
1. Nouveau tuteur
2. /start_onboarding
3. Validation N1
4. Accès aux offres
5. Candidature sur une offre
6. Assignation par un admin
7. Passage éventuel en N1A
8. /finish_onboarding
9. Validation de la formation complète
10. Passage en Tuteur - niveau 2
```

---

## Documentation associée

- `MANUEL_COMMANDES_ADMIN.md`
  Manuel d'utilisation des commandes admin en français

- `onboardingFlow.js`
  Référence de contenu pour l'onboarding

- `SETUP_FIREBASE.md`
  Documentation de configuration Firebase si disponible dans le projet

---

## Développement et maintenance

### Quand modifier `onboardingFlow.js`

Modifier ce fichier si tu veux changer :
- le contenu d'une formation
- les quiz
- les titres
- les descriptions
- l'ordre des étapes

### Quand modifier `shiftModule.js`

Modifier ce fichier si tu veux changer :
- les commandes `/shift`
- les filtres admin
- la logique d'assignation
- la forme des messages liés aux offres

### Quand modifier `adminModule.js`

Modifier ce fichier si tu veux changer :
- les commandes `/admin`
- la visibilité des retours admin
- les actions de reset ou de consultation de progression

### Réenregistrement des commandes

Après un changement de slash command :

```bash
npm run register
```

ou redémarrer le bot si l'enregistrement au démarrage est utilisé.

---

## Dépannage

### Le bot ne répond pas

Vérifier :
- que le bot est bien lancé
- que `DISCORD_TOKEN` est valide
- que les slash commands sont enregistrées

### Une commande slash n'apparaît pas

Vérifier :
- le redémarrage du bot
- le réenregistrement des commandes
- les permissions admin si la commande est réservée aux administrateurs

### Les rôles ne s'attribuent pas

Vérifier :
- la hiérarchie des rôles Discord
- que le rôle du bot est au-dessus des rôles gérés
- les IDs de rôles dans `.env`

### Les offres ou assignations ne persistent pas

Vérifier :
- la configuration Firebase
- le chemin de `GOOGLE_APPLICATION_CREDENTIALS`
- les droits Firestore

---

## Valeur stratégique

Pour Centre Reed, ce projet n'est pas seulement un bot Discord. C'est un outil interne qui :
- réduit le temps administratif
- améliore la qualité et la cohérence de l'onboarding
- diminue les erreurs humaines
- structure le pipeline de recrutement et d'assignation
- professionnalise l'expérience des tuteurs et des admins

Autrement dit, il transforme Discord en véritable interface opérationnelle pour une partie du fonctionnement de la compagnie.

---

## Propriété

Projet interne Centre Reed.
Usage interne uniquement.
