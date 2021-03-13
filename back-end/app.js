const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
};

// Setup body parser
app.use(express.json());

// CORS Pre-Flight
app.options('*', cors(corsOptions));

app.get('/questions', (req, res) => {
    res.json({ question: 1, string: 'test' });
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
