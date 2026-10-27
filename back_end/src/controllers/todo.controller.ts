import { Response } from 'express';
import { pool } from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getTodos = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createTodo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, due_date } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO todos (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
      [userId, title, description || null, due_date || null]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: userId,
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

export const updateTodo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, is_completed, due_date } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE todos 
       SET title = COALESCE(?, title), 
           description = COALESCE(?, description), 
           is_completed = COALESCE(?, is_completed), 
           due_date = COALESCE(?, due_date) 
       WHERE id = ? AND user_id = ?`,
      [title, description, is_completed, due_date, id, userId]
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

export const deleteTodo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
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