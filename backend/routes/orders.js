const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', auth, [
  body('productId').isInt().withMessage('Product ID is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, date, time } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isAvailable) {
      return res.status(400).json({ message: 'Product is not available' });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        productId: parseInt(productId),
        date,
        time,
        status: 'PENDING'
      },
      include: {
        product: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', adminAuth, [
  body('status').isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: true
      }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order (User can cancel their own orders)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'CANCELLED' },
      include: {
        product: true
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
