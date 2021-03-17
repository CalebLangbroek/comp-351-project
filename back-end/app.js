import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import questionsRouter from './routes/question-router.js';

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
};

// Setup body parser
app.use(express.json());

// CORS Pre-Flight
app.use(cors(corsOptions));

// Setup routing
app.use(questionsRouter);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
