import express from 'express';
import cors from 'cors';
import { postSignup } from './controllers/signup.js';
import { postSignin } from './controllers/signin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', postSignup);
app.post('/signin', postSignin);

export default app;
