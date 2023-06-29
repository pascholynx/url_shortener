const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.post('/shorten', urlController.shortenUrl);
router.post('/custom', urlController.customUrl);
router.post('/qr', urlController.qrCode);
router.get('/:code', urlController.redirectUrl);
router.get('/:code/analytics', urlController.urlAnalytics);
router.get('/analytics', urlController.generalAnalytics);
router.get('/history', urlController.history);

module.exports = router;
