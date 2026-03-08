const express = require('express');
const { createAdmin, loginUser, regenerateToken, changesPassword } = require('../controller/auth.controller');
const isValidUserRequest = require('../middlewares/checkUser');
const authRoute = express.Router();


authRoute.post('/create-admin', createAdmin);
authRoute.post('/loggedin-user', loginUser);
authRoute.post('/generate-token', regenerateToken);
authRoute.put('/changes-password',isValidUserRequest, changesPassword);


module.exports = authRoute;