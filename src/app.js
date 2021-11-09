import express from 'express';
import cors from 'cors';
import { getProducts } from './controllers/productsController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

export default app;
