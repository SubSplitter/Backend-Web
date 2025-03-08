// src/config/configuration.ts
// Add this to your existing configuration
export default () => ({
    // ... your existing config
    dodo: {
      apiUrl: process.env.DODO_API_URL || 'https://api.dodo.com/v1',
      apiKey: process.env.DODO_API_KEY,
      webhookSecret: process.env.DODO_WEBHOOK_SECRET,
    },
  });