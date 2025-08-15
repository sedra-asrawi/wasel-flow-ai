import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.66d89ba8d8a149dcb3f2046550026590',
  appName: 'wasel-flow-ai',
  webDir: 'dist',
  server: {
    url: 'https://66d89ba8-d8a1-49dc-b3f2-046550026590.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#5bc0be',
      showSpinner: false
    }
  }
};

export default config;