const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(cors());
app.use(express.json());

// WORKERS
require('./workers/index');

// Router
const filesRouter = require('./routes/files');

// Mounting routes
app.use('/files', filesRouter)

// app.use('/assets', express.static(path.join(__dirname, 'FE', 'dist', 'assets')));

// app.get('*', (req, res) => {
//     console.log('--------------------');
//     res.sendFile(path.join(__dirname, 'FE', 'dist', 'index.html'));
// })

app.listen(5000, () => {
    console.log(5000);
})
