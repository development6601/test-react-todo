import type { Todo, TodoFilter, TodoStats } from '../types';++

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const filterTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  return todos.filter(todo => {
    const statusMatch = filter.status === 'all' || 
      (filter.status === 'completed' && todo.completed) ||
      (filter.status === 'active' && !todo.completed);
    
    const categoryMatch = filter.category === 'all' || todo.category === filter.category;
    const priorityMatch = filter.priority === 'all' || todo.priority === filter.priority;
    
    return statusMatch && categoryMatch && priorityMatch;
  });
};

export const sortTodos = (todos: Todo[], sortBy: 'date' | 'priority' | 'alphabetical'): Todo[] => {
  const sortedTodos = [...todos];
  
  switch (sortBy) {
    case 'date':
      return sortedTodos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sortedTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    case 'alphabetical':
      return sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
    default:
      return sortedTodos;
  }
};

export const calculateStats = (todos: Todo[]): TodoStats => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  
  return { total, completed, active };
};

export const getUniqueCategories = (todos: Todo[]): string[] => {
  const categories = todos.map(todo => todo.category);
  return ['all', ...Array.from(new Set(categories.filter(cat => cat !== '')))];
}; 
