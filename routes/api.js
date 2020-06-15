var express = require('express');
var router = express.Router();

const adapterController = require('../controller/adapter.controller');

// *** Adapter Routes *** /

// Used as main TradingView web-hook endpoint: your_ip+/alert
router.post('/alert', (req, res, next) => adapterController.determineStrategy(req, res, next));

module.exports = router;