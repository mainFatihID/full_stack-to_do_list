const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string;
  created_at?: string;
}

const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export async function fetchTodos(): Promise<Todo[]> {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authentication token found');
  }

  const res = await fetch(`${API_URL}/todos`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export async function createTodo(data: { title: string; description?: string; due_date?: string }): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export async function updateTodo(id: number, data: Partial<Todo>): Promise<void> {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update todo');
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete todo');
}