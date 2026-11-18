'use client';

import { useState, useEffect } from 'react';
import { getTasks, createTask, toggleTask, SortOption } from './actions';
import { Task } from './actions';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sort, setSort] = useState<SortOption>('date-asc');
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on mount and when sort changes
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const data = await getTasks(sort);
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, [sort]);

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  const handleCreateTask = async (formData: FormData) => {
    await createTask(formData);
    // Reload tasks after creating
    const data = await getTasks(sort);
    setTasks(data);
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    await toggleTask(id, completed);
    // Reload tasks after toggling
    const data = await getTasks(sort);
    setTasks(data);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          To-Do List
        </h1>

        {/* Add task form */}
        <form action={handleCreateTask} className="flex gap-2 mb-8">
          <input
            name="title"
            type="text"
            required
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-5 py-2 font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Add
          </button>
        </form>

        {/* Sort options */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <label className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center">
            Sort by:
          </label>
          <button
            onClick={() => handleSortChange('date-asc')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sort === 'date-asc'
                ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            Date (Oldest)
          </button>
          <button
            onClick={() => handleSortChange('date-desc')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sort === 'date-desc'
                ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            Date (Newest)
          </button>
          <button
            onClick={() => handleSortChange('alphabetical')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sort === 'alphabetical'
                ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            Alphabetical
          </button>
        </div>

        {/* Task list */}
        <ul className="space-y-2">
          {isLoading && (
            <li className="text-zinc-400 text-center py-8">Loading tasks...</li>
          )}
          {!isLoading && tasks.length === 0 && (
            <li className="text-zinc-400 text-center py-8">No tasks yet. Add one above!</li>
          )}
          {!isLoading && tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3"
            >
              <button
                onClick={() => handleToggleTask(task.id, !task.completed)}
                className={`h-5 w-5 rounded border-2 flex-shrink-0 transition-colors ${
                  task.completed
                    ? 'bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50'
                    : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-500'
                }`}
                aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.completed && (
                  <svg viewBox="0 0 12 12" className="text-white dark:text-zinc-900 w-full h-full p-0.5">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  task.completed
                    ? 'line-through text-zinc-400'
                    : 'text-zinc-800 dark:text-zinc-100'
                }`}
              >
                {task.title}
              </span>
            </li>
          ))}
        </ul>

        {!isLoading && tasks.length > 0 && (
          <p className="mt-4 text-xs text-zinc-400 text-right">
            {tasks.filter((t) => t.completed).length} / {tasks.length} completed
          </p>
        )}
      </div>
    </div>
  );
}
