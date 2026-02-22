import {
  getRozeniteDevToolsClient,
  RozeniteDevToolsClient,
} from '@rozenite/plugin-bridge';

import { AllStoresSnapshot, EventMap, StoreSnapshot } from './types';

const PLUGIN_ID = 'rozenite-zustand-devtools';

export type StoreEntry = {
  name: string;
  store: {
    getState: () => Record<string, unknown>;
    subscribe: (listener: () => void) => () => void;
  };
};

function toSnapshot(state: Record<string, unknown>): StoreSnapshot {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  );
}

function getAllSnapshots(stores: StoreEntry[]): AllStoresSnapshot {
  return Object.fromEntries(
    stores.map(({ name, store }) => [name, toSnapshot(store.getState())])
  );
}

function setupSubscriptions(
  client: RozeniteDevToolsClient<EventMap>,
  stores: StoreEntry[]
) {
  client.onMessage('zustand:request-snapshot', () => {
    client.send('zustand:snapshot', getAllSnapshots(stores));
  });

  stores.forEach(({ name, store }) => {
    let rafId: ReturnType<typeof requestAnimationFrame> | null = null;

    store.subscribe(() => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        client.send('zustand:store-update', {
          storeName: name,
          state: toSnapshot(store.getState()),
        });
      });
    });
  });
}

export async function initZustandDevTools(stores: StoreEntry[]) {
  try {
    const client = await getRozeniteDevToolsClient<EventMap>(PLUGIN_ID);
    setupSubscriptions(client, stores);
  } catch {
    // Silently fail when DevTools is not available
  }
}
