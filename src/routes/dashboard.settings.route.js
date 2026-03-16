
const express = require('express');
const { addSettings, updateSettings } = require('../controller/dashboard.settings.controller');
const isValidUserRequest = require('../middlewares/checkUser');

const route = express.Router();

route.post('/add-settings-info', isValidUserRequest, addSettings)
route.put('/update-settings-info', isValidUserRequest, updateSettings)

module.exports = route;