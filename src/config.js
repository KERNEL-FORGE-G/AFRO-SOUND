import {Platform} from 'react-native';

const PROD_BACKEND_URL = 'https://afro-sound.vercel.app';

const LOCAL_HOSTS = {
  android: '10.0.2.2',
  ios: 'localhost',
  default: '127.0.0.1',
};

const resolveLocalHost = () => LOCAL_HOSTS[Platform.OS] || LOCAL_HOSTS.default;

export const CONFIG = {
  APP_NAME: 'AFRO SOUND',
  BACKEND_URL: PROD_BACKEND_URL,
  LOCAL_SERVER_PORT: 3000,
  LOCAL_SERVER_HOST: resolveLocalHost(),
  API_TIMEOUT_MS: 10000,
};

export const getLocalBackendUrl = () =>
  `http://${CONFIG.LOCAL_SERVER_HOST}:${CONFIG.LOCAL_SERVER_PORT}`;

export const getBaseUrl = () =>
  __DEV__ ? getLocalBackendUrl() : CONFIG.BACKEND_URL;

export const getApiUrl = path => `${getBaseUrl()}${path}`;

export const getServerTargets = () => ({
  production: CONFIG.BACKEND_URL,
  local: getLocalBackendUrl(),
  active: getBaseUrl(),
});
