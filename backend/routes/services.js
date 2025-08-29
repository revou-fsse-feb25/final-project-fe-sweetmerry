const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Get all services with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, active } = req.query;
    
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new service (admin only)
router.post('/', [
  authenticateToken,
  authorizeAdmin,
  body('name').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('price').isFloat({ min: 0 }),
  body('duration').isInt({ min: 1 }),
  body('category').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, duration, category, image } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        category,
        image: image || null,
        isActive: true
      }
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update service (admin only)
router.put('/:id', [
  authenticateToken,
  authorizeAdmin,
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('price').optional().isFloat({ min: 0 }),
  body('duration').optional().isInt({ min: 1 }),
  body('category').optional().trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, duration, category, image, isActive } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(duration && { duration: parseInt(duration) }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive: isActive === 'true' || isActive === true })
      }
    });

    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete service (admin only)
router.delete('/:id', [authenticateToken, authorizeAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get service categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.service.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });

    const uniqueCategories = [...new Set(categories.map(c => c.category))];
    res.json(uniqueCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
