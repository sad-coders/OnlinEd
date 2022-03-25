const express = require('express')
const dotenv = require('dotenv')
 
const cors = require('cors');
const path = require('path')
const mongodb = require('mongodb')
 
const app = express()
app.use(cors())
app.use(express.json())
 
 
app.use('/test', (req, res) => {

    console.log(req);
    
    res.send('Hello World!! Testing success');
})
// app.use('/api/v1/shop', require('./routes/'))


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
