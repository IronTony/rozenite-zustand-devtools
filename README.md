# rozenite-zustand-devtools

A [Rozenite](https://github.com/callstackincubator/rozenite) DevTools plugin for inspecting [Zustand](https://github.com/pmndrs/zustand) store state in React Native apps.

Browse, search, and inspect all your Zustand stores in real time directly from the Rozenite DevTools panel; no middleware or store modifications required.

## Features

- **Real-time state inspection**: See live updates as your Zustand stores change
- **Table & JSON views**: Toggle between a structured key-value table and raw JSON
- **Collapsible nested objects**: Expand/collapse objects and arrays in table view
- **Color-coded values**: Strings (green), numbers (blue), booleans (purple), null/undefined (gray)
- **Store filtering**: Quickly find stores by name when you have many registered
- **Copy to clipboard**: One-click copy of any store's state as formatted JSON
- **Last updated timestamps**: See when each store was last modified
- **Auto-select on load**: First store is selected automatically when the panel opens
- **Zero store modifications**: Works with any Zustand store out of the box via `getState()` and `subscribe()`
- **Debounced updates**: Uses `requestAnimationFrame` to batch rapid state changes and avoid flooding the bridge
- **Production-safe**: The hook is replaced with a no-op in production builds, so no devtools code ships to users

## Prerequisites

- [Rozenite](https://github.com/callstackincubator/rozenite) integrated in your React Native project
- [Zustand](https://github.com/pmndrs/zustand) for state management

## Installation

```bash
npm install -D rozenite-zustand-devtools
```

## Setup

### 1. Define your stores

Create a file to list the Zustand stores you want to inspect (e.g., `services/zustand/devtools.ts`):

```typescript
import type { StoreEntry } from 'rozenite-zustand-devtools';
import { useMyStore } from './myStore';
import { useAuthStore } from './authStore';

export const zustandStores: StoreEntry[] = [
  { name: 'myStore', store: useMyStore },
  { name: 'auth', store: useAuthStore },
];
```

### 2. Call the hook in your root component

Add `useZustandDevTools` in your root layout or `App.tsx`, alongside your other Rozenite hooks:

```tsx
import { useZustandDevTools } from 'rozenite-zustand-devtools';
import { zustandStores } from './services/zustand/devtools';

export default function Layout() {
  // Safe to call unconditionally — no-ops in production
  useZustandDevTools(zustandStores);

  return <>{/* ... */}</>;
}
```

### 3. Start with Rozenite enabled

```bash
WITH_ROZENITE=true npx expo start -c
```

Open the Rozenite DevTools and you'll see a **Zustand** tab with all your registered stores.

## How It Works

The plugin has two parts that communicate over Rozenite's WebSocket bridge:

### React Native side (runs in your app)

The `useZustandDevTools` hook:

1. Connects to the Rozenite DevTools host via `useRozeniteDevToolsClient` from `@rozenite/plugin-bridge`
2. Sends an initial snapshot of all stores on mount
3. Subscribes to each Zustand store using the standard `.subscribe()` API
4. On any state change, serializes the store state (excluding functions) and sends it to the DevTools panel
5. Responds to snapshot requests from the panel with the full state of all stores
6. Debounces updates using `requestAnimationFrame` to prevent bridge flooding during rapid state changes
7. Cleans up all subscriptions on unmount

### DevTools panel (runs in the browser)

The panel renders inside the Rozenite DevTools as an iframe and:

1. Requests a full snapshot of all stores on mount
2. Listens for incremental `store-update` events as state changes
3. Displays stores in a two-column layout: store list on the left, state inspector on the right
4. Supports both **Table view** (structured key-value with collapsible nesting) and **JSON view** (raw formatted JSON)

### Communication events

| Event | Direction | Description |
|-------|-----------|-------------|
| `zustand:request-snapshot` | Panel -> App | Panel requests current state of all stores |
| `zustand:snapshot` | App -> Panel | Full state snapshot of all registered stores |
| `zustand:store-update` | App -> Panel | Incremental update for a single store |

## API

### `useZustandDevTools(stores: StoreEntry[])`

React hook that connects to the Rozenite DevTools and sends live Zustand state updates. Safe to call unconditionally — in production, the hook is replaced with a no-op at the entry-point level, so no devtools code is bundled.

- **stores**: Array of stores to register

```typescript
type StoreEntry = {
  name: string;
  store: {
    getState: () => Record<string, unknown>;
    subscribe: (listener: () => void) => () => void;
  };
};
```

Any Zustand store created with `create()` satisfies the `store` interface, no wrappers needed. The `name` is what appears in the DevTools sidebar.

## Compatibility

| Dependency | Version |
|------------|---------|
| Rozenite | >= 1.3.0 |
| Zustand | Any version (uses standard `getState`/`subscribe` API) |
| React Native | >= 0.70 |
| React | >= 18 |

## License

MIT
