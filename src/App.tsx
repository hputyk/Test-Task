import React, { useState } from 'react';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { moveTask, addColumn } from '@/store/kanbanSlice';
import Column from '@/components/Column';
import AddColumnModal from '@/components/AddColumnModal';
import ErrorBoundary from '@/components/ErrorBoundary';

const AppContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
  background: #e0e0e0;
  
  @media (max-width: 390px) {
    padding: 10px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 390px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 24px;
  
  @media (max-width: 390px) {
    font-size: 20px;
    text-align: center;
  }
`;

const AddColumnButton = styled.button`
  background: transparent;
  color: #333;
  border: 2px solid #333;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(51, 51, 51, 0.1);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const BoardContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
  
  @media (max-width: 390px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(state => state.kanban.columns);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [draggedTask, setDraggedTask] = useState<{ columnId: string; taskId: string } | null>(null);

  const handleDragStart = (e: React.DragEvent, columnId: string, taskId: string) => {
    setDraggedTask({ columnId, taskId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.columnId !== toColumnId) {
      dispatch(moveTask({
        fromColumnId: draggedTask.columnId,
        toColumnId,
        taskId: draggedTask.taskId,
      }));
    }
    setDraggedTask(null);
  };

  const handleAddColumn = (title: string, color: string) => {
    dispatch(addColumn({ title, color }));
  };

  return (
    <AppContainer>
      <Header>
        <Title>Kanban Board</Title>
        <AddColumnButton onClick={() => setShowAddColumn(true)}>
          +
        </AddColumnButton>
      </Header>
      
      <BoardContainer>
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </BoardContainer>
      
      {showAddColumn && (
        <AddColumnModal
          onClose={() => setShowAddColumn(false)}
          onSave={handleAddColumn}
        />
      )}
    </AppContainer>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;