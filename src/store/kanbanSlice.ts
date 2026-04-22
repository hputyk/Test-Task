import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KanbanState, Column, Task } from '@/types';

const loadState = (): KanbanState => {
  const saved = localStorage.getItem('kanbanData');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        color: '#ff6b6b',
        tasks: [],
      },
      {
        id: 'progress',
        title: 'In Progress',
        color: '#4ecdc4',
        tasks: [],
      },
      {
        id: 'done',
        title: 'Done',
        color: '#45b7d1',
        tasks: [],
      },
    ],
  };
};

const initialState: KanbanState = loadState();

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<{ title: string; color: string }>) => {
      const newColumn: Column = {
        id: Date.now().toString(),
        title: action.payload.title,
        color: action.payload.color,
        tasks: [],
      };
      state.columns.push(newColumn);
      localStorage.setItem('kanbanData', JSON.stringify(state));
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(col => col.id !== action.payload);
      localStorage.setItem('kanbanData', JSON.stringify(state));
    },
    updateColumnColor: (state, action: PayloadAction<{ id: string; color: string }>) => {
      const column = state.columns.find(col => col.id === action.payload.id);
      if (column) {
        column.color = action.payload.color;
        localStorage.setItem('kanbanData', JSON.stringify(state));
      }
    },
    addTask: (state, action: PayloadAction<{ columnId: string; task: Task }>) => {
      const column = state.columns.find(col => col.id === action.payload.columnId);
      if (column) {
        column.tasks.push(action.payload.task);
        localStorage.setItem('kanbanData', JSON.stringify(state));
      }
    },
    updateTask: (state, action: PayloadAction<{ columnId: string; task: Task }>) => {
      const column = state.columns.find(col => col.id === action.payload.columnId);
      if (column) {
        const index = column.tasks.findIndex(t => t.id === action.payload.task.id);
        if (index !== -1) {
          column.tasks[index] = action.payload.task;
          localStorage.setItem('kanbanData', JSON.stringify(state));
        }
      }
    },
    deleteTask: (state, action: PayloadAction<{ columnId: string; taskId: string }>) => {
      const column = state.columns.find(col => col.id === action.payload.columnId);
      if (column) {
        column.tasks = column.tasks.filter(t => t.id !== action.payload.taskId);
        localStorage.setItem('kanbanData', JSON.stringify(state));
      }
    },
    moveTask: (
      state,
      action: PayloadAction<{
        fromColumnId: string;
        toColumnId: string;
        taskId: string;
      }>
    ) => {
      const fromColumn = state.columns.find(col => col.id === action.payload.fromColumnId);
      const toColumn = state.columns.find(col => col.id === action.payload.toColumnId);
      
      if (fromColumn && toColumn) {
        const taskIndex = fromColumn.tasks.findIndex(t => t.id === action.payload.taskId);
        if (taskIndex !== -1) {
          const task = fromColumn.tasks[taskIndex];
          fromColumn.tasks.splice(taskIndex, 1);
          toColumn.tasks.push(task);
          localStorage.setItem('kanbanData', JSON.stringify(state));
        }
      }
    },
  },
});

export const {
  addColumn,
  deleteColumn,
  updateColumnColor,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;