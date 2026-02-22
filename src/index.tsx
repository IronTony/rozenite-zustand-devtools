import { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView } from 'react-native';

import { StoreDetail } from './StoreDetail';
import { StoreList } from './StoreList';
import { useZustandDevTools } from './useZustandDevTools';

export default function ZustandDevToolsPanel() {
  const { stores, lastUpdated } = useZustandDevTools();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const hasAutoSelected = useRef(false);

  const storeNames = Object.keys(stores).filter((name) =>
    name.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (!hasAutoSelected.current && storeNames.length > 0) {
      setSelected(storeNames[0]);
      hasAutoSelected.current = true;
    }
  }, [storeNames]);

  const selectedState = selected ? stores[selected] : null;

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TextInput
          placeholder="Filter stores..."
          placeholderTextColor="#6b7280"
          value={filter}
          onChangeText={setFilter}
          style={styles.filterInput}
        />
        <StoreList
          storeNames={storeNames}
          selected={selected}
          lastUpdated={lastUpdated}
          onSelect={setSelected}
        />
      </View>
      <ScrollView style={styles.content}>
        {selectedState ? (
          <StoreDetail storeName={selected!} state={selectedState} />
        ) : (
          <Text style={styles.placeholder}>
            Select a store to inspect its state.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
  },
  sidebar: {
    width: 240,
    borderRightWidth: 1,
    borderRightColor: '#374151',
    padding: 12,
    gap: 8,
  },
  filterInput: {
    padding: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 6,
    backgroundColor: '#111827',
    color: '#e5e7eb',
    fontSize: 13,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    opacity: 0.5,
    fontFamily: 'monospace',
    color: '#e5e7eb',
  },
});
