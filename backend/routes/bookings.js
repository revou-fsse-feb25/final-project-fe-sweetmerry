const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Get all bookings (admin gets all, user gets their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const where = {};
    
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.userId;
    }
    
    if (status) {
      where.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              duration: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            description: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Users can only access their own bookings unless they're admin
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new booking
router.post('/', [
  authenticateToken,
  body('serviceId').isString(),
  body('date').isISO8601(),
  body('time').isString(),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, date, time, notes } = req.body;

    // Check if service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (!service.isActive) {
      return res.status(400).json({ message: 'Service is not available' });
    }

    // Check for conflicting bookings
    const bookingDate = new Date(date);
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        serviceId,
        date: bookingDate,
        time,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.userId,
        serviceId,
        date: bookingDate,
        time,
        notes: notes || null,
        status: 'PENDING'
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            duration: true
          }
        }
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update booking
router.put('/:id', [
  authenticateToken,
  body('status').optional().isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Users can only update their own bookings unless they're admin
    if (req.user.role !== 'ADMIN' && existingBooking.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only admin can change status to COMPLETED
    if (status === 'COMPLETED' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admin can complete bookings' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        service: {
          select: {
            name: true,
            price: true
          }
        }
      }
    });

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete booking (admin only)
router.delete('/:id', [authenticateToken, authorizeAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.booking.delete({
      where: { id }
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get booking statistics (admin only)
router.get('/stats/overview', [authenticateToken, authorizeAdmin], async (req, res) => {
  try {
    const [totalBookings, pendingBookings, confirmedBookings, completedBookings, cancelledBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } })
    ]);

    res.json({
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
