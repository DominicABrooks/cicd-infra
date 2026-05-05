import { Router, Response } from 'express';
import pool from '../config/db.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createItemSchema, updateItemSchema, itemIdParamSchema } from '../schemas/items.js';

const router = Router();

// All item routes require authentication
router.use(requireAuth);

/**
 * @openapi
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: "My Item"
 *               description:
 *                 type: string
 *                 example: "A useful description"
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createItemSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user!.id;

    const result = await pool.query(
      'INSERT INTO items (name, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

/**
 * @openapi
 * /api/items:
 *   get:
 *     summary: List all items for the authenticated user
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of items
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('List items error:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

/**
 * @openapi
 * /api/items/{id}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The item
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', validate(itemIdParamSchema, 'params'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      'SELECT * FROM items WHERE id = $1 AND user_id = $2',
      [req.params.id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get item error:', err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

/**
 * @openapi
 * /api/items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', validate(itemIdParamSchema, 'params'), validate(updateItemSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user!.id;

    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, description, req.params.id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update item error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

/**
 * @openapi
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', validate(itemIdParamSchema, 'params'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      'DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
