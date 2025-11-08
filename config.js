require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  
  // Canaux
  channels: {
    onboarding: process.env.CHANNEL_ONBOARDING,
    contrats: process.env.CHANNEL_CONTRATS,
    equipe: process.env.CHANNEL_EQUIPE,
  },
  
  // Rôles
  roles: {
    candidat: process.env.ROLE_CANDIDAT,
    tuteurN1: process.env.ROLE_TUTEUR_N1,
    tuteurN1A: process.env.ROLE_TUTEUR_N1A, // Tuteur Apparié
    tuteurN2: process.env.ROLE_TUTEUR_N2,
  },
};

