import express from 'express';
import cors from 'cors';
import { postSignup } from './controllers/signup';
import { postSignin } from './controllers/signin';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', postSignup);
app.post('/signin', postSignin);

export default app;
