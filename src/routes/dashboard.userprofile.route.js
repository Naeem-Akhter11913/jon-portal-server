const express = require('express');
const { addCompanyDetails, updateCompanyDetails } = require('../controller/dashboard.userprofile.controller');
const isValidUserRequest = require('../middlewares/checkUser');

const routes = express.Router();

routes.post('/add-company-profile', isValidUserRequest, addCompanyDetails);
routes.post('/update-company-profile', isValidUserRequest, updateCompanyDetails);

module.exports = routes;