import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  storeNames: string[];
  selected: string | null;
  lastUpdated: Record<string, number>;
  onSelect: (name: string) => void;
};

export function StoreList({
  storeNames,
  selected,
  lastUpdated,
  onSelect,
}: Props) {
  return (
    <View style={styles.list}>
      {storeNames.map((name) => (
        <Pressable
          key={name}
          onPress={() => onSelect(name)}
          style={[
            styles.item,
            name === selected && styles.selectedItem,
          ]}
        >
          <Text
            style={[
              styles.itemText,
              name === selected && styles.selectedItemText,
            ]}
          >
            {name}
          </Text>
          {lastUpdated[name] && (
            <Text style={styles.timestamp}>
              {new Date(lastUpdated[name]).toLocaleTimeString()}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 2,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectedItem: {
    backgroundColor: '#3b82f6',
  },
  itemText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#e5e7eb',
  },
  selectedItemText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    opacity: 0.6,
    color: '#e5e7eb',
  },
});
