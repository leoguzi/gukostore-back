import express from 'express';
import cors from 'cors';
import { getProducts, productById } from './controllers/productsController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/products/:id', productById);

export default app;
