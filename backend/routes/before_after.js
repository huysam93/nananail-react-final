const express = require('express');
const router = express.Router();
const controller = require('../controllers/before_after_controller');

router.get('/before-after', controller.getAllImages);
router.post('/before-after', controller.createImage);
router.delete('/before-after/:id', controller.deleteImage);

module.exports = router;
