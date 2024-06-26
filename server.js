const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/main.routes');
const cors = require('cors');
const { findUserWithHigherDesignation , findUserWithHigherProficiency ,findAdminUsers } = require('./app/controllers/dynamicApproverAllocation.support.controller');

// create express app
const app = express();

app.use(cors({
    origin: '*'
  }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Api"});
});

// Routes
app.use('/api',routes); // Use the central route file



// listen for requests
app.listen(process.env.NODE_PORT , () => {
    console.log("Server is listening on port ",process.env.NODE_PORT );
});