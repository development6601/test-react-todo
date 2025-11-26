export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface TodoFilter {
  status: 'all' | 'active' | 'completed';
  category: string;
  priority: 'all' | 'low' | 'medium' | 'high';
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
} 