import { TodoStats as TodoStatsType } from '../../types/Todo';
import './TodoStats.css';

interface TodoStatsProps {
  stats: TodoStatsType;
  onClearCompleted: () => void;
  onToggleAll: () => void;
}

export const TodoStats = ({ stats, onClearCompleted, onToggleAll }: TodoStatsProps) => {
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="todo-stats">
      <div className="stats-overview">
        <h3 className="stats-title">Overview</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{completionPercentage}%</span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
        
        {stats.total > 0 && (
          <div className="progress-bar">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="progress-text">{completionPercentage}% Complete</span>
          </div>
        )}
      </div>

      {stats.total > 0 && (
        <div className="stats-actions">
          <button
            onClick={onToggleAll}
            className="action-button toggle-all-button"
          >
            {stats.completed === stats.total ? 'Mark All Active' : 'Mark All Complete'}
          </button>
          {stats.completed > 0 && (
            <button
              onClick={onClearCompleted}
              className="action-button clear-button"
            >
              Clear Completed ({stats.completed})
            </button>
          )}
        </div>
      )}
    </div>
  );
}; 