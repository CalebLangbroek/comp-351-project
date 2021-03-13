const express = require('express');
const cors = require('cors');
require('dotenv').config();

const questionsRouter = require('./routes/questions');

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
};

// Setup body parser
app.use(express.json());

// CORS Pre-Flight
app.options('*', cors(corsOptions));

app.use(questionsRouter);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
