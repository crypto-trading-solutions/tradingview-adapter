var express = require('express');
var router = express.Router();

const adapterController = require('../controller/adapter.controller');

// *** Adapter Routes *** /

// Used as main TradingView web-hook endpoint
router.post('/alert', (req, res, next) => adapterController.determineStrategy(req, res, next));

router.post('/occ_data_agregator', (req, res, next) => adapterController.occ_data_agregator(req, res, next));

module.exports = router;