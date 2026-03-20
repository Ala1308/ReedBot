require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  
  // Canaux
  channels: {
    onboarding: process.env.CHANNEL_ONBOARDING,
    contrats: process.env.CHANNEL_OFFRES || process.env.CHANNEL_CONTRATS, // #offres
    equipe: process.env.CHANNEL_EQUIPE,
    annonce: process.env.CHANNEL_ANNONCE || process.env.CHANNEL_OFFRES,
    formation: process.env.CATEGORY_FORMATION || process.env.CHANNEL_FORMATION,
  },
  
  // Rôles
  roles: {
    candidat: process.env.ROLE_CANDIDAT,
    tuteurN1: process.env.ROLE_TUTEUR_N1,
    tuteurN1A: process.env.ROLE_TUTEUR_N1A, // Tuteur Apparié
    tuteurN2: process.env.ROLE_TUTEUR_N2,
  },
};

