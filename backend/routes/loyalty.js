const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/loyalty_controller');

// Public
router.get('/loyalty/lookup/:phone', ctrl.getMemberByPhone);
router.post('/loyalty/register', ctrl.registerMember);

// Admin
router.get('/loyalty/members', ctrl.getAllMembers);
router.post('/loyalty/members/:id/points', ctrl.addPoints);
router.put('/loyalty/members/:id', ctrl.updateMember);
router.delete('/loyalty/members/:id', ctrl.deleteMember);
router.get('/loyalty/stats', ctrl.getStats);

module.exports = router;
