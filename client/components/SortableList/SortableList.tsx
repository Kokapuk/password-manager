import cn from 'classnames';
import { DragEvent, ReactNode, useEffect, useState } from 'react';
import styles from './SortableList.module.scss';

interface Props<T> {
  data: T[];
  sortable?: boolean;
  getListItem(item: T): ReactNode;
  getItemKey(item: T): any;
  onSort(data: T[]): void;
}

const SortableList = <T,>({ data, sortable = true, getListItem, getItemKey, onSort }: Props<T>) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      setDraggingIndex(null);  
      setDragOverIndex(null);
    }

    document.addEventListener('mouseup', handleMouseUp);

    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [])
  
  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    if (index === draggingIndex) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.effectAllowed = 'move';

    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggingIndex === null) {
      return;
    }

    const newData = [...data];
    newData.splice(index, 0, newData.splice(draggingIndex, 1)[0]);
    onSort(newData);
  };

  return data.map((item, index) => (
    <div
      draggable={sortable}
      key={getItemKey(item)}
      onDragStart={() => setDraggingIndex(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragLeave={() => setDragOverIndex(null)}
      onDragEnd={() => setDraggingIndex(null)}
      onDrop={() => handleDrop(index)}
      className={cn(
        styles.itemContainer,
        draggingIndex !== null && draggingIndex !== index && styles.slotAvailable,
        draggingIndex !== null &&
          dragOverIndex === index &&
          (dragOverIndex < draggingIndex ? styles.slotAbove : styles.slotBelow)
      )}
    >
      {getListItem(item)}
    </div>
  ));
};

export default SortableList;
