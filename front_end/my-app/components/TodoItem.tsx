'use client';

import { Todo } from '../services/api';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggleComplete, onDelete }: TodoItemProps) {
  return (
    <li className="p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={() => onToggleComplete(todo)}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
        />
        <div>
          <p
            className={`font-medium ${
              todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p className="text-sm text-gray-500 mt-0.5">{todo.description}</p>
          )}
          {todo.due_date && (
            <span className="text-xs text-blue-500 mt-1 inline-block">
              Due: {new Date(todo.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition"
      >
        Delete
      </button>
    </li>
  );
}