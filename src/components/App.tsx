import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import { FaClipboardList, FaMoon, FaSun, FaFilter, FaSort } from 'react-icons/fa';

export type TodoCategory = 'all' | 'active' | 'completed';
export type SortOption = 'createdAt' | 'dueDate' | 'priority';
export type SortDirection = 'asc' | 'desc';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminder?: Date;
};

// Load todos from localStorage
const loadTodos = (): Todo[] => {
  const saved = localStorage.getItem('todos');
  if (saved) {
    return JSON.parse(saved, (key, value) => {
      if (key === 'createdAt') {
        return new Date(value);
      }
      return value;
    });
  }
  return [];
};

// Load theme from localStorage
const loadTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
};

const App = () => {
  console.log('App mounted');
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [theme, setTheme] = useState<'light' | 'dark'>(loadTheme);
  const [filter, setFilter] = useState<TodoCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [priorityFilter, setPriorityFilter] = useState<Todo['priority'] | 'all'>('all');

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Add reminder check effect
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (
          todo.reminder && 
          !todo.completed && 
          new Date(todo.reminder) <= now && 
          Notification.permission === 'granted'
        ) {
          new Notification('Todo Reminder', {
            body: `Reminder for task: ${todo.text}`,
            icon: '/favicon.ico'
          });
        }
      });
    };

    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todos]);

  const handleAddTodo = (
    text: string, 
    priority: Todo['priority'] = 'medium',
    dueDate?: Date,
    reminder?: Date
  ) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
      priority,
      dueDate,
      reminder,
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = (id: string, newText: string, newPriority: Todo['priority']) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text: newText, priority: newPriority }
        : todo
    ));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getSortedAndFilteredTodos = () => {
    let filtered = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(todo => todo.priority === priorityFilter);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return sortDirection === 'asc' ? diff : -diff;
      }
      
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
        if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;
        return sortDirection === 'asc' 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedTodos = getSortedAndFilteredTodos();

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="min-h-screen bg-base-200 py-8 transition-colors duration-200">
      <div className="max-w-md mx-auto">
        <div className="bg-base-100 rounded-box shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaClipboardList className="text-3xl text-primary" />
              <h1 className="text-2xl font-bold text-base-content">Todo List</h1>
            </div>
            <button
              onClick={toggleTheme}
              className="btn btn-circle btn-ghost hover:bg-base-200 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <FaMoon className="text-primary hover:scale-110 transition-transform" /> : 
                <FaSun className="text-warning hover:scale-110 transition-transform" />
              }
            </button>
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="tabs tabs-boxed justify-center bg-base-200 p-1 rounded-lg">
              <button 
                className={`tab tab-lg transition-all duration-200 ${
                  filter === 'all' ? 'tab-active bg-primary text-primary-content' : 'hover:text-primary'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`tab tab-lg transition-all duration-200 ${
                  filter === 'active' ? 'tab-active bg-primary text-primary-content' : 'hover:text-primary'
                }`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button 
                className={`tab tab-lg transition-all duration-200 ${
                  filter === 'completed' ? 'tab-active bg-primary text-primary-content' : 'hover:text-primary'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>

            <div className="flex gap-2 justify-center">
              <div className="dropdown">
                <button className="btn btn-sm btn-outline hover:btn-primary transition-all duration-200">
                  <FaFilter className="mr-2" /> Priority
                </button>
                <ul className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button 
                      className={`${priorityFilter === 'all' ? 'bg-primary text-primary-content' : ''} 
                        hover:bg-primary/20 transition-colors duration-200`}
                      onClick={() => setPriorityFilter('all')}
                    >
                      All Priorities
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`text-error hover:bg-error/20 transition-colors duration-200 ${
                        priorityFilter === 'high' ? 'bg-error/10' : ''
                      }`}
                      onClick={() => setPriorityFilter('high')}
                    >
                      High
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`text-warning hover:bg-warning/20 transition-colors duration-200 ${
                        priorityFilter === 'medium' ? 'bg-warning/10' : ''
                      }`}
                      onClick={() => setPriorityFilter('medium')}
                    >
                      Medium
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`text-success hover:bg-success/20 transition-colors duration-200 ${
                        priorityFilter === 'low' ? 'bg-success/10' : ''
                      }`}
                      onClick={() => setPriorityFilter('low')}
                    >
                      Low
                    </button>
                  </li>
                </ul>
              </div>

              <div className="dropdown">
                <button className="btn btn-sm btn-outline hover:btn-primary transition-all duration-200">
                  <FaSort className="mr-2" /> Sort By
                </button>
                <ul className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button 
                      className={`hover:bg-primary/20 transition-colors duration-200 ${
                        sortBy === 'createdAt' ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => setSortBy('createdAt')}
                    >
                      Creation Date
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`hover:bg-primary/20 transition-colors duration-200 ${
                        sortBy === 'dueDate' ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => setSortBy('dueDate')}
                    >
                      Due Date
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`hover:bg-primary/20 transition-colors duration-200 ${
                        sortBy === 'priority' ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => setSortBy('priority')}
                    >
                      Priority
                    </button>
                  </li>
                </ul>
              </div>

              <button 
                className="btn btn-sm btn-outline hover:btn-primary transition-all duration-200"
                onClick={toggleSortDirection}
                aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <AddTodo onAddTodo={handleAddTodo} />
          
          <div className="stats shadow w-full mb-6">
            <div className="stat">
              <div className="stat-title">Active Tasks</div>
              <div className="stat-value text-primary">{activeTodos.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Completed</div>
              <div className="stat-value text-success">{completedTodos.length}</div>
            </div>
          </div>

          <TodoList 
            todos={filteredAndSortedTodos} 
            onToggleComplete={handleToggleComplete} 
            onDeleteTodo={handleDeleteTodo} 
            onEditTodo={handleEditTodo}
          />

          {todos.length > 0 && (
            <>
              <div className="divider mt-6"></div>
              <div className="flex justify-between items-center text-sm text-base-content/60">
                <span>{todos.length} total tasks</span>
                <button 
                  className="btn btn-ghost btn-xs hover:btn-error hover:text-white transition-all duration-200"
                  onClick={() => setTodos(todos.filter(t => !t.completed))}
                >
                  Clear completed
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App; 