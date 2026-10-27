'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import { Todo, fetchTodos, updateTodo, deleteTodo } from '@/services/api';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadTodos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos', error);
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My To-Do List</h1>
            <p className="text-gray-500 mt-1">Manage your daily tasks efficiently</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition text-sm font-medium"
          >
            Logout
          </button>
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
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}