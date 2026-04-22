export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | null;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export interface KanbanState {
  columns: Column[];
}