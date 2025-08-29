const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all bookings (admin) or user's bookings (user)
router.get('/', authenticateToken, [
  query('status').optional().isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  query('date').optional().isISO8601(),
  query('serviceId').optional().trim()
], async (req, res) => {
  try {
    const { status, date, serviceId } = req.query;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // Build where clause
    const where = {};

    // If not admin, only show user's bookings
    if (!isAdmin) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (date) {
      where.date = new Date(date);
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    const bookings = await prisma.booking.findMany({
      where,
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
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      bookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

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
            category: true,
            description: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user has access to this booking
    if (!isAdmin && booking.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
});

// Create new booking
router.post('/', authenticateToken, [
  body('serviceId').trim().notEmpty(),
  body('date').isISO8601(),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, date, time, notes } = req.body;
    const userId = req.user.id;

    // Check if service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (!service.isActive) {
      return res.status(400).json({ error: 'Service is not available' });
    }

    // Check if booking date is in the future
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({ error: 'Booking date must be in the future' });
    }

    // Check for conflicting bookings (same service, date, and time)
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        serviceId,
        date: bookingDate,
        time,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date: bookingDate,
        time,
        notes
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

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status (admin only) or cancel booking (user)
router.put('/:id', authenticateToken, [
  body('status').optional().isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  body('date').optional().isISO8601(),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, date, time, notes } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true }
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user has access to this booking
    if (!isAdmin && existingBooking.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build update data
    const updateData = {};
    if (notes !== undefined) updateData.notes = notes;

    // Only admin can change status
    if (isAdmin && status) {
      updateData.status = status;
    }

    // Handle date and time changes
    if (date || time) {
      const newDate = date ? new Date(date) : existingBooking.date;
      const newTime = time || existingBooking.time;

      // Check if booking date is in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (newDate < today) {
        return res.status(400).json({ error: 'Booking date must be in the future' });
      }

      // Check for conflicting bookings
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          serviceId: existingBooking.serviceId,
          date: newDate,
          time: newTime,
          status: {
            in: ['PENDING', 'CONFIRMED']
          },
          id: {
            not: id
          }
        }
      });

      if (conflictingBooking) {
        return res.status(400).json({ error: 'This time slot is already booked' });
      }

      updateData.date = newDate;
      updateData.time = newTime;
    }

    // Users can only cancel their own bookings
    if (!isAdmin && status === 'CANCELLED') {
      if (existingBooking.status === 'COMPLETED') {
        return res.status(400).json({ error: 'Cannot cancel completed booking' });
      }
      updateData.status = 'CANCELLED';
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
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

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Delete booking (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.booking.delete({
      where: { id }
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Get booking statistics (admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' }
    });
    const confirmedBookings = await prisma.booking.count({
      where: { status: 'CONFIRMED' }
    });
    const completedBookings = await prisma.booking.count({
      where: { status: 'COMPLETED' }
    });
    const cancelledBookings = await prisma.booking.count({
      where: { status: 'CANCELLED' }
    });

    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await prisma.booking.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    res.json({
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
      today: todayBookings
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ error: 'Failed to get booking statistics' });
  }
});

module.exports = router;
