'use client';

import { useEffect, useState, useCallback } from 'react';
import TodoForm from './components/TodoForm/page';
import { Todo, fetchTodos, updateTodo, deleteTodo } from './services/api';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleToggleComplete = async (todo: Todo) => {
    try {
      await updateTodo(todo.id, { is_completed: !todo.is_completed });
      loadTodos();
    } catch (error) {
      console.error('Failed to update todo', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Failed to delete todo', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My To-Do List</h1>
          <p className="text-gray-500 mt-1">Manage your daily tasks efficiently</p>
        </header>

        <TodoForm onTodoAdded={loadTodos} />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b font-semibold text-gray-700">Tasks</div>
          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading tasks...</p>
          ) : todos.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No tasks found. Add one above!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li key={todo.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={todo.is_completed}
                      onChange={() => handleToggleComplete(todo)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className={`font-medium ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.title}
                      </p>
                      {todo.description && (
                        <p className="text-sm text-gray-500">{todo.description}</p>
                      )}
                      {todo.due_date && (
                        <span className="text-xs text-blue-500 mt-1 inline-block">
                          Due: {new Date(todo.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}