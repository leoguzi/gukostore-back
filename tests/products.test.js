import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';


describe('GET /products', () => {
    it('Returns an array with the products information', async () => {
        const result = await supertest(app).get('/products');

        expect(result.status).toEqual(200);
        expect(result.body[0]).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number),
            images: expect.any(Array),
            categories: expect.any(Array)
        }
        )

    })
})

