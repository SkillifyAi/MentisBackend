import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'



/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
import dotenv from 'dotenv'

dotenv.config()

// Create the Express application
const app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
import './config/database.js'

// Must first load the models
import './models/user.js';

// Logger function

app.use(morgan('tiny'))

// For creating cookies

app.use(cookieParser())

// File parser

app.use(fileUpload())

// Instead of using body-parser middleware, use the new Express implementation of the same thing

app.use(express.urlencoded({extended: true}));

// Allows our Angular application to make HTTP requests to Express application


const corsOptions = {
    origin: process.env.URL || "http://localhost:5173",
    credentials: true
};

app.use(cors(corsOptions));


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js

import routes from './routes/index.js'

app.use(routes);


/**
 * -------------- SERVER ----------------
 */


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
});

app.get('/', (req, res) => {
    res.send("App is working")
})