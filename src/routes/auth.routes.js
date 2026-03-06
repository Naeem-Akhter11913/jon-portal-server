const express = require('express');
const { createAdmin } = require('../controller/auth.controller');
const authRoute = express.Router();


authRoute.get('/create-admin', createAdmin);


module.exports = authRoute