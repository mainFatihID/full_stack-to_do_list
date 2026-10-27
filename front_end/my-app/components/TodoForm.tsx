'use client';

import { useState } from 'react';
import { createTodo } from '@/services/api';

interface TodoFormProps {
  onTodoAdded: () => void;
}

export default function TodoForm({ onTodoAdded }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      await createTodo({
        title,
        description: description || undefined,
        due_date: dueDate || undefined,
      });

      setTitle('');
      setDescription('');
      setDueDate('');
      onTodoAdded(); // Refresh the todo list
    } catch (err: any) {
      console.error('Error creating todo:', err);
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Add New Task</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          rows={2}
        />
      </div>
      <div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium cursor-pointer disabled:bg-blue-300"
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}