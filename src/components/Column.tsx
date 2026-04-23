import React, { useState } from 'react';
import styled from 'styled-components';
import { Column as ColumnType, Task } from '@/types';
import TaskCard from './TaskCard';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteColumn, updateColumnColor, addTask} from '@/store/kanbanSlice';
import AddTaskModal from './AddTaskModal';

interface ColumnProps {
  column: ColumnType;
  onDragStart: (e: React.DragEvent, columnId: string, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
}

const ColumnContainer = styled.div`
  background: #f5f5f5;
  border-radius: 24px;  /* было 8px → сильно округло */
  padding: 12px;
  min-width: 300px;
  height: fit-content;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div<{ color: string }>`
  background: ${props => props.color};
  padding: 12px;
  border-radius: 20px;  /* было 6px → крутые бока */
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColumnTitle = styled.h3`
  margin: 0;
  color: white;
  font-size: 16px;
`;

const TaskCount = styled.span`
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 40px;  /* было 12px → почти круг */
  font-size: 12px;
  color: white;
`;

const ColorInput = styled.input`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 20px;  /* было 4px → круглый */
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 40px;  /* было 4px → сильно круглый */
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const AddTaskButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 40px;  /* было 4px → круглая кнопка */
  cursor: pointer;
  margin-top: 12px;
  &:hover {
    background: #45a049;
  }
`;

const TasksContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 100px;
`;

const ColumnComponent: React.FC<ColumnProps> = ({ column, onDragStart, onDragOver, onDrop }) => {
  const dispatch = useAppDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditingColor, setIsEditingColor] = useState(false);

  const handleDeleteColumn = () => {
    if (window.confirm('Delete this column?')) {
      dispatch(deleteColumn(column.id));
    }
  };

  const handleColorChange = (color: string) => {
    dispatch(updateColumnColor({ id: column.id, color }));
    setIsEditingColor(false);
  };

  const handleAddTask = (task: Task) => {
    dispatch(addTask({ columnId: column.id, task }));
  };

  return (
    <ColumnContainer
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <ColumnHeader color={column.color}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ColumnTitle>{column.title}</ColumnTitle>
          <TaskCount>{column.tasks.length}</TaskCount>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isEditingColor ? (
            <ColorInput
              type="color"
              value={column.color}
              onChange={(e) => handleColorChange(e.target.value)}
              onBlur={() => setIsEditingColor(false)}
              autoFocus
            />
          ) : (
            <ColorInput
              type="color"
              value={column.color}
              onChange={(e) => handleColorChange(e.target.value)}
              title="Change column color"
            />
          )}
          <DeleteButton onClick={handleDeleteColumn}>×</DeleteButton>
        </div>
      </ColumnHeader>
      
      <TasksContainer>
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            onDragStart={onDragStart}
          />
        ))}
      </TasksContainer>
      
      <AddTaskButton onClick={() => setShowAddModal(true)}>
        + Add Task
      </AddTaskButton>
      
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTask}
        />
      )}
    </ColumnContainer>
  );
};

export default ColumnComponent;