import React, { useState } from 'react';
import { Todo } from './App';
import { FaCheck, FaTimes, FaClock, FaMinus, FaEdit, FaSave, FaBell } from 'react-icons/fa';

type TodoListProps = {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string, newPriority: Todo['priority']) => void;
};

const TodoList = ({ todos, onToggleComplete, onDeleteTodo, onEditTodo }: TodoListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState<Todo['priority']>('medium');

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditPriority(todo.priority);
  };

  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      onEditTodo(id, editText, editPriority);
      setEditingId(null);
    }
  };

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-base-content/50">
        <FaClock className="text-4xl mb-2" />
        <p className="text-center">No todos yet. Add one above!</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={`card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${
            todo.priority === 'high' ? 'border-l-4 border-error' :
            todo.priority === 'medium' ? 'border-l-4 border-warning' :
            'border-l-4 border-success'
          }`}
        >
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => onToggleComplete(todo.id)}
                  className={`btn btn-circle btn-sm ${
                    todo.completed ? 'btn-success' : 'btn-ghost'
                  } hover:scale-105 transition-all duration-200 ease-in-out`}
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                >
                  <span className="transition-opacity duration-200">
                    {todo.completed ? <FaCheck /> : <FaMinus />}
                  </span>
                </button>
                <div className="flex flex-col flex-1">
                  {editingId === todo.id ? (
                    <div className="join">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="input input-bordered input-sm join-item flex-1"
                        autoFocus
                      />
                      <div className="dropdown dropdown-end join-item">
                        <button 
                          type="button"
                          className={`btn btn-sm ${
                            editPriority === 'high' ? 'btn-error' :
                            editPriority === 'medium' ? 'btn-warning' :
                            'btn-success'
                          } join-item`}
                        >
                          Priority
                        </button>
                        <ul className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box">
                          <li><button onClick={() => setEditPriority('high')} className="text-error">High</button></li>
                          <li><button onClick={() => setEditPriority('medium')} className="text-warning">Medium</button></li>
                          <li><button onClick={() => setEditPriority('low')} className="text-success">Low</button></li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleEditSave(todo.id)}
                        className="btn btn-sm btn-primary join-item"
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <span className={`${
                          todo.completed 
                            ? 'line-through text-base-content/50' 
                            : 'text-base-content'
                          } transition-all duration-200`}
                        >
                          {todo.text}
                        </span>
                        <div className="flex gap-2 text-xs text-base-content/60">
                          <span>{formatDate(todo.createdAt)}</span>
                          {todo.dueDate && (
                            <span className={`flex items-center gap-1 ${
                              new Date(todo.dueDate) < new Date() && !todo.completed 
                                ? 'text-error' 
                                : ''
                            }`}>
                              <FaClock className="inline" />
                              Due: {formatDateTime(todo.dueDate)}
                            </span>
                          )}
                          {todo.reminder && (
                            <span className="flex items-center gap-1">
                              <FaBell className="inline" />
                              Reminder: {formatDateTime(todo.reminder)}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {!editingId && !todo.completed && (
                  <button
                    onClick={() => handleEditStart(todo)}
                    className="btn btn-ghost btn-sm"
                    aria-label={`Edit "${todo.text}"`}
                  >
                    <FaEdit />
                  </button>
                )}
                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="btn btn-ghost btn-sm text-error hover:bg-error/20"
                  aria-label={`Delete "${todo.text}"`}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList; 