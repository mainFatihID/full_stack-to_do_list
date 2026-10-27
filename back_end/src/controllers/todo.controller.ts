import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Get all todos for a specific user (hardcoded user_id = 1 for simplicity before auth)
export const getTodos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
      [1]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, due_date } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO todos (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
      [1, title, description || null, due_date || null]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: 1,
      title,
      description,
      is_completed: false,
      due_date
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update todo (toggle complete or edit)
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, is_completed, due_date } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE todos 
       SET title = COALESCE(?, title), 
           description = COALESCE(?, description), 
           is_completed = COALESCE(?, is_completed), 
           due_date = COALESCE(?, due_date) 
       WHERE id = ? AND user_id = ?`,
      [title, description, is_completed, due_date, id, 1]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, 1]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};