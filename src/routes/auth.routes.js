const express = require('express');
const { createAdmin, loginUser, regenerateToken, resetPassword, forgetPassword } = require('../controller/auth.controller');
const isValidUserRequest = require('../middlewares/checkUser');
const authRoute = express.Router();


authRoute.post('/create-admin', createAdmin);
authRoute.post('/loggedin-user', loginUser);
authRoute.post('/generate-token', regenerateToken);
authRoute.post('/forget-password', forgetPassword);
authRoute.put('/changes-password',isValidUserRequest, resetPassword);


module.exports = authRoute;