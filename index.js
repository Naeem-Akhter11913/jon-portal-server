const express = require('express');
require('dotenv').config({ debug: true })
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
require('./src/database/connect');
const swaggerSpec = require("./src/config/swagger");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const swaggerUi = require("swagger-ui-express");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const dashboardAuthRoute = require('./src/routes/dashboard.auth.routes');
const dashboardDetailsRoute = require('./src/routes/dashboard.userprofile.route');

app.use('/auth', dashboardAuthRoute);
app.use('/dashboard', dashboardDetailsRoute);


app.use((err, req, res, next) => {
    console.error('Global error:', err);
    
    res.status(err.statusCode || 500).send({
        status: false,
        message: err.message || "Internal Server Error"
    });
});

app.listen(8080, () => {
    console.log('Server is listing on port 8080: http://localhost:8080')
})