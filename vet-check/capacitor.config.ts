import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.madavi.vetcheck',
  appName: 'Vet Check',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
