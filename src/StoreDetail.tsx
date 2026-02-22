import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

type ViewMode = 'table' | 'json';

type Props = {
  storeName: string;
  state: Record<string, unknown>;
};

function renderValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return JSON.stringify(value, null, 2);
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function getValueColor(value: unknown): string {
  if (value === null || value === undefined) return '#6b7280';
  if (typeof value === 'string') return '#a5d6a7';
  if (typeof value === 'boolean') return '#ce93d8';
  if (typeof value === 'number') return '#90caf9';
  return '#d1d5db';
}

function TableRow({ keyName, value, depth = 0 }: { keyName: string; value: unknown; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const isExpandable = value !== null && typeof value === 'object';
  const paddingLeft = 12 + depth * 16;

  return (
    <>
      <Pressable
        onPress={isExpandable ? () => setExpanded((prev) => !prev) : undefined}
        style={[styles.tableRow, { paddingLeft }]}
      >
        <View style={styles.keyCell}>
          {isExpandable && (
            <Text style={styles.expandIcon}>{expanded ? '\u25BC' : '\u25B6'}</Text>
          )}
          <Text style={styles.keyText}>{keyName}</Text>
        </View>
        <View style={styles.valueCell}>
          {isExpandable && !expanded ? (
            <Text style={styles.collapsedPreview}>
              {Array.isArray(value)
                ? `Array(${(value as unknown[]).length})`
                : `Object(${Object.keys(value as Record<string, unknown>).length})`}
            </Text>
          ) : !isExpandable ? (
            <Text style={[styles.valueText, { color: getValueColor(value) }]}>
              {renderValue(value)}
            </Text>
          ) : null}
        </View>
      </Pressable>
      {isExpandable && expanded && (
        Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <TableRow key={k} keyName={k} value={v} depth={depth + 1} />
        ))
      )}
    </>
  );
}

export function StoreDetail({ storeName, state }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{storeName}</Text>
        <View style={styles.headerActions}>
          <View style={styles.toggleGroup}>
            <Pressable
              onPress={() => setViewMode('table')}
              style={[styles.toggleButton, viewMode === 'table' && styles.toggleActive]}
            >
              <Text style={[styles.toggleText, viewMode === 'table' && styles.toggleTextActive]}>
                Table
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode('json')}
              style={[styles.toggleButton, viewMode === 'json' && styles.toggleActive]}
            >
              <Text style={[styles.toggleText, viewMode === 'json' && styles.toggleTextActive]}>
                JSON
              </Text>
            </Pressable>
          </View>
          <Pressable onPress={handleCopy} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>Copy JSON</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.contentArea}>
        {viewMode === 'json' ? (
          <View style={styles.jsonContainer}>
            <Text style={styles.jsonText}>
              {JSON.stringify(state, null, 2)}
            </Text>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Key</Text>
              <Text style={styles.tableHeaderText}>Value</Text>
            </View>
            {Object.entries(state).map(([key, value]) => (
              <TableRow key={key} keyName={key} value={value} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#e5e7eb',
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 4,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#1f2937',
  },
  toggleActive: {
    backgroundColor: '#3b82f6',
  },
  toggleText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  toggleTextActive: {
    color: '#fff',
  },
  copyButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 4,
    backgroundColor: '#1f2937',
  },
  copyButtonText: {
    color: '#e5e7eb',
    fontSize: 12,
  },
  contentArea: {
    flex: 1,
  },
  jsonContainer: {
    backgroundColor: '#111827',
    borderRadius: 6,
    padding: 12,
  },
  jsonText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
    color: '#d1d5db',
  },
  tableContainer: {
    backgroundColor: '#111827',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    alignItems: 'flex-start',
  },
  keyCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandIcon: {
    fontSize: 8,
    color: '#6b7280',
    width: 12,
  },
  keyText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#93c5fd',
  },
  valueCell: {
    flex: 1,
  },
  valueText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  collapsedPreview: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
