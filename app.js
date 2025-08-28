import 'dotenv/config';
import express from 'express';
import {
    verifyKeyMiddleware,
} from 'discord-interactions';

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});