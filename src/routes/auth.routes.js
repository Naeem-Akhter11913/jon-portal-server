const express = require('express');
const { createAdmin } = require('../controller/auth.controller');
const authRoute = express.Router();


authRoute.post('/create-admin', createAdmin);


module.exports = authRoute;