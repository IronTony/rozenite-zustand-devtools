import { useRozeniteDevToolsClient } from '@rozenite/plugin-bridge';
import { useEffect } from 'react';

import type {
  AllStoresSnapshot,
  EventMap,
  StoreEntry,
  StoreSnapshot,
} from './types';

const PLUGIN_ID = 'rozenite-zustand-devtools';

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

export function useZustandDevToolsNative(stores: StoreEntry[]) {
  const client = useRozeniteDevToolsClient<EventMap>({
    pluginId: PLUGIN_ID,
  });

  useEffect(() => {
    if (!client) return;

    client.send('zustand:snapshot', getAllSnapshots(stores));

    const unsubRequest = client.onMessage('zustand:request-snapshot', () => {
      client.send('zustand:snapshot', getAllSnapshots(stores));
    });

    const unsubscribes = stores.map(({ name, store }) => {
      let rafId: ReturnType<typeof requestAnimationFrame> | null = null;
      return store.subscribe(() => {
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

    return () => {
      unsubRequest.remove();
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [client, stores]);
}
