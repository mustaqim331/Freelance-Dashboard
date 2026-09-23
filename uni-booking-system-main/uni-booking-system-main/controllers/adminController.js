// controllers/adminController.js
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const User = require('../models/User');

// GET /admin/resources - Manage facilities & equipment
exports.getManageResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({ order: [['createdAt', 'DESC']] });
    res.render('admin/resources', {
      title: 'Facility & Equipment Management',
      resources,
      success: req.query.success || null,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /admin/resources/add - Add new facility/equipment
exports.addResource = async (req, res) => {
  const { name, category, location, capacity, requiresApproval } = req.body;
  try {
    await Resource.create({
      name,
      category,
      location,
      capacity: capacity ? parseInt(capacity) : null,
      requiresApproval: requiresApproval === 'on',
      isActive: true
    });
    res.redirect('/admin/resources?success=Resource added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /admin/resources/toggle/:id - Toggle active/inactive status
exports.toggleResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (resource) {
      resource.isActive = !resource.isActive;
      await resource.save();
    }
    res.redirect('/admin/resources');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /admin/resources/delete/:id - Remove facility/equipment
exports.deleteResource = async (req, res) => {
  try {
    await Resource.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/resources?success=Resource removed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};