var express = require('express');
var router = express.Router();

const adapterController = require('../controller/adapter.controller');

// *** Adapter Routes *** /

router.post('/alert', (req, res, next) => adapterController.determineStrategy(req, res, next));

module.exports = router;