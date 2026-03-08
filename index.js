const express = require('express');
require('dotenv').config()
const app = express();
const cors = require("cors");
require('./src/database/connect');
const swaggerSpec = require("./src/config/swagger");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const swaggerUi = require("swagger-ui-express");

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const authRoute = require('./src/routes/auth.routes');

app.use('/auth', authRoute)

app.listen(8080, () =>{
    console.log('Server is listing on port 8080: http://localhost:8080')
})