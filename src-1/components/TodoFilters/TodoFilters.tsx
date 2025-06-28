import type { TodoFilter } from '../../types';
import './TodoFilters.css';

interface TodoFiltersProps {
  filter: TodoFilter;
  sortBy: 'date' | 'priority' | 'alphabetical';
  categories: string[];
  onFilterChange: (filter: TodoFilter) => void;
  onSortChange: (sortBy: 'date' | 'priority' | 'alphabetical') => void;
}

export const TodoFilters = ({ 
  filter, 
  sortBy, 
  categories, 
  onFilterChange, 
  onSortChange 
}: TodoFiltersProps) => {
  const handleStatusChange = (status: 'all' | 'active' | 'completed') => {
    onFilterChange({ ...filter, status });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filter, category });
  };

  const handlePriorityChange = (priority: 'all' | 'low' | 'medium' | 'high') => {
    onFilterChange({ ...filter, priority });
  };

  return (
    <div className="todo-filters">
      <div className="filter-section">
        <h3 className="filter-title">Filters</h3>
        
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter.status === 'all' ? 'active' : ''}`}
              onClick={() => handleStatusChange('all')}
            >
              All
            </button>
            <button
              className={`filter-button ${filter.status === 'active' ? 'active' : ''}`}
              onClick={() => handleStatusChange('active')}
            >
              Active
            </button>
            <button
              className={`filter-button ${filter.status === 'completed' ? 'active' : ''}`}
              onClick={() => handleStatusChange('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={filter.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Priority</label>
          <select
            value={filter.priority}
            onChange={(e) => handlePriorityChange(e.target.value as 'all' | 'low' | 'medium' | 'high')}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="sort-section">
        <h3 className="filter-title">Sort By</h3>
        <div className="sort-buttons">
          <button
            className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
            onClick={() => onSortChange('date')}
          >
            Date
          </button>
          <button
            className={`sort-button ${sortBy === 'priority' ? 'active' : ''}`}
            onClick={() => onSortChange('priority')}
          >
            Priority
          </button>
          <button
            className={`sort-button ${sortBy === 'alphabetical' ? 'active' : ''}`}
            onClick={() => onSortChange('alphabetical')}
          >
            A-Z
          </button>
        </div>
      </div>
    </div>
  );
}; 