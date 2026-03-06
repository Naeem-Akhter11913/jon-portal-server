const express = require('express');
require('dotenv').config()
const app = express();
require('./src/database/connect')

const authRoute = require('./src/routes/auth.routes');

app.use('/auth', authRoute)

app.listen(8080, () =>{
    console.log('Server is listing on port 8080: http://localhost:8080')
})