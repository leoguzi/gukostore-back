import express from 'express';
import cors from 'cors';
import  postSignup  from './controllers/signup.js';
import  postSignin  from './controllers/signin.js';
import { getProducts, productById } from './controllers/productsController.js';
import postOrder from './controllers/ordersController.js';

const app = express();
app.use(cors());
app.use(express.json());
// ACCES CONTROL
app.post('/signup', postSignup);
app.post('/signin', postSignin);

// PRODUCTS
app.get('/products', getProducts);
app.get('/products/:id', productById);

// ORDERS
app.post('/orders', postOrder);

export default app;
