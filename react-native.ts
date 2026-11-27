import type { StoreEntry } from './src/types.js';
// Keep the lazy module in Rozenite's static build graph without loading it in production.
import type { useZustandDevToolsNative } from './src/useZustandDevToolsNative.js';

const isReactNative =
  typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

const useZustandDevTools: (stores: StoreEntry[]) => void =
  process.env.NODE_ENV !== 'production' && isReactNative
    ? (require('./src/useZustandDevToolsNative.js') as {
        useZustandDevToolsNative: typeof useZustandDevToolsNative;
      }).useZustandDevToolsNative
    : () => {};

export { useZustandDevTools };
export type { StoreEntry };
