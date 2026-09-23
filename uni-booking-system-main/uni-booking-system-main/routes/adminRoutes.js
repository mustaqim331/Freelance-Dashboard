// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuth, hasRole } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(isAuth, hasRole('ADMIN'));

router.get('/resources', adminController.getManageResources);
router.post('/resources/add', adminController.addResource);
router.post('/resources/toggle/:id', adminController.toggleResource);
router.post('/resources/delete/:id', adminController.deleteResource);

module.exports = router;