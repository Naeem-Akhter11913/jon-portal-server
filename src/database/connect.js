const mongoose = require('mongoose');
const connectionURL = process.env.CONNECTION_STRING
mongoose.connect(connectionURL).then(() => {
    console.log('MongoDB Connected Successfully');
}).catch(err => {
    console.error('MongoDB Connection Error:', err);
})