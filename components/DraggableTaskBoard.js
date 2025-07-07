import React, { useCallback } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import TaskCard from './TaskCard';

export default function DraggableTaskBoard({ data, onDragEnd }) {
  const renderItem = useCallback(
    ({ item, drag, isActive }) => (
      <TaskCard
        task={item}
        onLongPress={drag}
        style={{ opacity: isActive ? 0.8 : 1 }}
      />
    ),
    []
  );

  return (
    <DraggableFlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      onDragEnd={({ data }) => onDragEnd(data)}
    />
  );
}
