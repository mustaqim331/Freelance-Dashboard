// controllers/bookingController.js
const { Op } = require('sequelize');
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');

// Render the main booking page with all active resources
exports.getBookingPage = async (req, res) => {
  try {
    const selectedCategory = req.query.category || 'ALL';
    
    let filter = { isActive: true };
    if (selectedCategory !== 'ALL') {
      filter.category = selectedCategory;
    }

    const resources = await Resource.findAll({ where: filter });
    
    res.render('bookings/book', {
      title: 'Book Facilities & Equipment',
      resources,
      selectedCategory,
      error: null,
      success: null
    });
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).send('Server Error');
  }
};

// Handle booking submission with conflict checking
exports.createBooking = async (req, res) => {
  const { resourceId, startTime, endTime, purpose } = req.body;
  const userId = req.session.user.id;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Validate start and end times
    if (start >= end) {
      const resources = await Resource.findAll({ where: { isActive: true } });
      return res.render('bookings/book', {
        title: 'Book Facilities & Equipment',
        resources,
        selectedCategory: 'ALL',
        error: 'End time must be after start time.',
        success: null
      });
    }

    // 2. Overlap Check: Find if there's any active booking in this time window
    const existingConflict = await Booking.findOne({
      where: {
        resourceId,
        status: { [Op.ne]: 'CANCELLED' },
        [Op.and]: [
          { startTime: { [Op.lt]: end } },
          { endTime: { [Op.gt]: start } }
        ]
      }
    });

    if (existingConflict) {
      const resources = await Resource.findAll({ where: { isActive: true } });
      return res.render('bookings/book', {
        title: 'Book Facilities & Equipment',
        resources,
        selectedCategory: 'ALL',
        error: 'Slot unavailable! This resource is already booked for the selected time.',
        success: null
      });
    }

    // 3. Find resource to check if approval is required
    const resource = await Resource.findByPk(resourceId);
    const status = resource.requiresApproval ? 'PENDING' : 'APPROVED';

    // 4. Create Booking
    await Booking.create({
      userId,
      resourceId,
      startTime: start,
      endTime: end,
      purpose,
      status
    });

    const resources = await Resource.findAll({ where: { isActive: true } });
    const successMsg = resource.requiresApproval
      ? 'Booking request submitted! Pending admin approval.'
      : 'Booking confirmed successfully!';

    res.render('bookings/book', {
      title: 'Book Facilities & Equipment',
      resources,
      selectedCategory: 'ALL',
      error: null,
      success: successMsg
    });

  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).send('Server Error');
  }
};

// GET /book/my-bookings - Display user's reservations with week/month filtering
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const timeframe = req.query.timeframe || 'ALL'; // ALL, WEEK, MONTH

    let dateFilter = {};
    const now = new Date();

    if (timeframe === 'WEEK') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      dateFilter = { startTime: { [Op.gte]: oneWeekAgo } };
    } else if (timeframe === 'MONTH') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      dateFilter = { startTime: { [Op.gte]: oneMonthAgo } };
    }

    const bookings = await Booking.findAll({
      where: {
        userId,
        ...dateFilter
      },
      include: [{ model: Resource, attributes: ['name', 'category', 'location'] }],
      order: [['startTime', 'DESC']]
    });

    res.render('bookings/my-bookings', {
      title: 'My Bookings & History',
      bookings,
      timeframe,
      error: null,
      success: req.query.cancelled ? 'Booking cancelled successfully.' : null
    });
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).send('Server Error');
  }
};

// POST /book/cancel/:id - Cancel an upcoming reservation
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.session.user.id;

    const booking = await Booking.findOne({
      where: { id: bookingId, userId }
    });

    if (!booking) {
      return res.status(404).send('Booking not found or unauthorized');
    }

    // Update status to CANCELLED instead of deleting to keep audit trail
    booking.status = 'CANCELLED';
    await booking.save();

    res.redirect('/book/my-bookings?cancelled=true');
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).send('Server Error');
  }
};