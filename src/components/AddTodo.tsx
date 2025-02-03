import React, { useState } from 'react';
import { FaPlus, FaFlag, FaClock, FaBell } from 'react-icons/fa';
import type { Todo } from './App';

type AddTodoProps = {
  onAddTodo: (text: string, priority: Todo['priority'], dueDate?: Date, reminder?: Date) => void;
};

const AddTodo = ({ onAddTodo }: AddTodoProps) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [reminder, setReminder] = useState<string>('');
  const [showDates, setShowDates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(
        text.trim(), 
        priority,
        dueDate ? new Date(dueDate) : undefined,
        reminder ? new Date(reminder) : undefined
      );
      setText('');
      setPriority('medium');
      setDueDate('');
      setReminder('');
      setShowDates(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <div className="join w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="input input-bordered join-item w-full focus:outline-none"
          aria-label="Add new todo"
        />
        <div className="join-item dropdown dropdown-end">
          <label 
            tabIndex={0} 
            className={`btn btn-circle ${
              priority === 'high' ? 'btn-error' :
              priority === 'medium' ? 'btn-warning' :
              'btn-success'
            }`}
          >
            <FaFlag />
          </label>
          <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <button 
                type="button"
                onClick={() => setPriority('high')}
                className="text-error"
              >
                High Priority
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => setPriority('medium')}
                className="text-warning"
              >
                Medium Priority
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => setPriority('low')}
                className="text-success"
              >
                Low Priority
              </button>
            </li>
          </ul>
        </div>
        <div className="join-item">
          <button
            type="button"
            onClick={() => setShowDates(!showDates)}
            className={`btn btn-circle ${
              dueDate || reminder 
                ? 'btn-info' 
                : showDates 
                  ? 'btn-primary' 
                  : 'btn-ghost hover:btn-primary'
            } transition-all duration-200`}
            aria-label={showDates ? 'Hide date options' : 'Show date options'}
          >
            <FaClock className={showDates ? 'animate-pulse' : ''} />
          </button>
        </div>
        <div className="join-item">
          <button
            type="submit"
            className="btn btn-circle btn-primary"
            aria-label="Submit new todo"
            disabled={!text.trim()}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {showDates && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-base-200 rounded-lg animate-fadeIn">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FaClock className="text-primary" />
                Due Date
              </span>
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input input-bordered hover:input-primary focus:input-primary transition-colors duration-200"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FaBell className="text-primary" />
                Reminder
              </span>
            </label>
            <input
              type="datetime-local"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="input input-bordered hover:input-primary focus:input-primary transition-colors duration-200"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default AddTodo; 