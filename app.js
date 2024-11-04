const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes/route');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Routes
app.use('/', routes);

// app.use(cors({ origin:'*'}));

// Connect to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => { console.log("Successfully connected to database") })
    .catch(error => {
        console.log("[-] Mongoose error")
        console.log(error)
    })


app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})
