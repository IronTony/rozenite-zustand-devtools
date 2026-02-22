export type StoreSnapshot = Record<string, unknown>;

export type AllStoresSnapshot = Record<string, StoreSnapshot>;

export type EventMap = {
  'zustand:snapshot': AllStoresSnapshot;
  'zustand:store-update': { storeName: string; state: StoreSnapshot };
  'zustand:request-snapshot': undefined;
};
