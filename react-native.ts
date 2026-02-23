import type { StoreEntry } from './src/types';

const isDev = process.env.NODE_ENV !== 'production';
const isServer = typeof window === 'undefined';

// Explicit React Native detection
const isReactNative =
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative';

let useZustandDevTools: (stores: StoreEntry[]) => void;

if (isDev && isReactNative && !isServer) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useZustandDevTools =
    require('./src/useZustandDevToolsNative').useZustandDevToolsNative;
} else {
  useZustandDevTools = () => {};
}

export { useZustandDevTools };
export type { StoreEntry };