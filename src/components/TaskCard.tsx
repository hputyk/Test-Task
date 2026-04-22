import React, { useState } from 'react';
import styled from 'styled-components';
import { Task } from '@/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteTask, updateTask } from '@/store/kanbanSlice';
import EditTaskModal from './EditTaskModal';

interface TaskCardProps {
  task: Task;
  columnId: string;
  onDragStart: (e: React.DragEvent, columnId: string, taskId: string) => void;
}

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: move;
  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const CardTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
`;

const CardDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 40px;
  font-size: 10px;
  font-weight: bold;
  background: ${props => {
    switch (props.priority) {
      case 'High': return '#ff4444';
      case 'Medium': return '#ffaa44';
      case 'Low': return '#44ff44';
      default: return '#cccccc';
    }
  }};
  color: ${props => props.priority === 'Low' ? '#333' : 'white'};
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 40px;
  &:hover {
    background: #f0f0f0;
  }
`;

const TaskCard: React.FC<TaskCardProps> = ({ task, columnId, onDragStart }) => {
  const dispatch = useAppDispatch();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, columnId, task.id);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask({ columnId, taskId: task.id }));
    }
  };

  const handleUpdate = (updatedTask: Task) => {
    dispatch(updateTask({ columnId, task: updatedTask }));
  };

  return (
    <>
      <Card
        draggable
        onDragStart={handleDragStart}
      >
        <CardTitle>{task.title}</CardTitle>
        {task.description && <CardDescription>{task.description}</CardDescription>}
        {task.priority && <PriorityBadge priority={task.priority}>{task.priority}</PriorityBadge>}
        <CardActions>
          <ActionButton onClick={() => setShowEditModal(true)}>Edit</ActionButton>
          <ActionButton onClick={handleDelete}>Delete</ActionButton>
        </CardActions>
      </Card>
      
      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdate}
        />
      )}
    </>
  );
};

export default TaskCard;