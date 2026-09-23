const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuth } = require('../middleware/authMiddleware');

// Protect all booking routes with isAuth
router.use(isAuth);

// MUST place /my-bookings before any other patterns that might catch it
router.get('/my-bookings', bookingController.getUserBookings);
router.post('/cancel/:id', bookingController.cancelBooking);

// General book routes
router.get('/', bookingController.getBookingPage);
router.post('/', bookingController.createBooking);

module.exports = router;