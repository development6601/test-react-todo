import { useState, useEffect, useCallback } from 'react';
import type { Todo, TodoFilter } from '../types';
import { generateId, filterTodos, sortTodos } from '../utils/todoUtils';

const STORAGE_KEY = 'react-todo-app-2';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>({
    status: 'all',
    category: 'all',
    priority: 'all'
  });
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'alphabetical'>('date');

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedTodos = JSON.parse(stored).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((text: string, priority: 'low' | 'medium' | 'high' = 'medium', category: string = '') => {
    const newTodo: Todo = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority,
      category: category.trim()
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Pick<Todo, 'text' | 'priority' | 'category'>>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const toggleAll = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prev => prev.map(todo => ({ ...todo, completed: !allCompleted })));
  }, [todos]);

  // Get filtered and sorted todos
  const filteredTodos = sortTodos(filterTodos(todos, filter), sortBy);

  return {
    todos,
    filteredTodos,
    filter,
    sortBy,
    setFilter,
    setSortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    toggleAll
  };
}; 