import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';
import { query } from '../config/db.js';

export const router = express.Router();

// Get all projects
router.get('/', protect, asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT * FROM projects WHERE user_id = $1',
    [req.user.id]
  );
  res.json(result.rows);
}));

// Create user
router.post('/', protect, asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const result = await query(
    'INSERT INTO users (name, description, user_id) VALUES ($1, $2, $3) RETURNING *',
    [name, description, req.user.id]
  );

  res.status(201).json(result.rows[0]);
}));

// Update user
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const result = await query(
    'UPDATE user SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
    [name, description, req.params.id, req.user.id]
  );

  if (result.rows.length === 0) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json(result.rows[0]);
}));

// Delete user
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const result = await query(
    'DELETE FROM users WHERE id = $1 AND user_id = $2 RETURNING *',
    [req.params.id, req.user.id]
  );

  if (result.rows.length === 0) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json({ message: 'Project removed' });
}));
