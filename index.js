const express = require('express')
const dotenv = require('dotenv')
 
const cors = require('cors');
const path = require('path');
const db = require('./model/db.js');
 
const app = express()
app.use(cors())
app.use(express.json())

dotenv.config({ path: './config/config.env'})
console.log(process.env.AZURE_COSMOSDB_URL)
 
app.use('/test', (req, res) => {
    
    console.log(req);  
    res.send('Hello World!! Testing success');
})
app.use('/api/v1/classroom', require('./routes/classroomRouter'))


const PORT = process.env.PORT || 5000;

const dBConnectionString = process.env.AZURE_COSMOSDB_URL || "";
 

db.connect(dBConnectionString)
    .catch(err => {
        console.error(err.stack);
        process.exit(1)
    })
    .then(app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }));

// app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
