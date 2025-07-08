import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import colors from '../utils/colors';

export default function TaskCard({ task, onPress, onLongPress, style }) {
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(task)}
      onLongPress={() => onLongPress && onLongPress(task)}
      style={[styles.card, style]}
    >
      <Text style={styles.title}>{task.title}</Text>
      <Text numberOfLines={2} style={styles.desc}>
        {task.description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.status}>{task.status?.toUpperCase() || ''}</Text>
        <Text style={styles.date}>
          {task.createdAt?.toDate().toLocaleDateString() || ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 4
  },
  desc: {
    fontSize: 14,
    color: colors.accent,
    marginBottom: 8
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary
  },
  date: {
    fontSize: 12,
    color: colors.accent
  }
});
