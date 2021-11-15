import faker from 'faker';
import '../src/setup.js'
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import app from '../src/app.js';
import createUser from './factories/userFactory';
import createSession from './factories/sessionFactory.js';
import connection from '../src/database.js';

async function clearDatabase() {
    await connection.query('DELETE FROM order_product;');
    await connection.query('DELETE FROM orders;');
    await connection.query('DELETE FROM sessions;');
    await connection.query('DELETE FROM users;');
}

let user = {};
let session = {};
let order = {};
let config = {};
    
async function prepareData() {
    user = await createUser();
    session = await createSession(user);
    order = {
        cardNumber: faker.datatype.number({ min: 10000000, max: 99999999 }),
        products: [
            {
                "idProduct": faker.datatype.number({ min: 1, max: 41 }),
                "quantity": faker.datatype.number({ min: 1, max: 10 })
            },
            {
                "idProduct": faker.datatype.number({ min: 1, max: 41 }),
                "quantity": faker.datatype.number({ min: 1, max: 10 })
            },
            {
                "idProduct": faker.datatype.number({ min: 1, max: 41 }),
                "quantity": faker.datatype.number({ min: 1, max: 10 })
            },
            {
                "idProduct": faker.datatype.number({ min: 1, max: 41 }),
                "quantity": faker.datatype.number({ min: 1, max: 10 })
            }
        ]
    }
    config = {
        Authorization: `Bearer ${session.token}`
    }
}

describe('POST /orders', () => {
    beforeEach(async () => {
        await prepareData();
    });
    
    it('Returns 401 if no token provided', async () => {
        const result = await supertest(app).post('/orders').send(order);

        expect(result.status).toEqual(401);
        expect(result.body).toEqual({ message: 'Not logged in!' })

    });

    it('Returns 401 if invalid token provided', async () => {
        config.Authorization = `Bearer ${uuid()}`;
        const result = await supertest(app).post('/orders').set(config).send(order);

        expect(result.status).toEqual(401);
        expect(result.body).toEqual({ message: 'Not logged in!' })

    });

    it('Returns 400 if invalid body provided', async () => {
        order.products[0].quantity = 0;
        const result = await supertest(app).post('/orders').set(config).send(order);
        expect(result.status).toEqual(400);
        expect(result.body).toEqual({ message: 'Invalid body!' })
    });

    /*   it('Returns 201 for sucess', async () => {
        const result = await supertest(app).post('/orders').set(config).send(order);
        expect(result.status).toEqual(201);
    });   */

    afterEach(async () => {
        await clearDatabase();
    })
});

describe('GET /orders', () => {
    beforeEach(async () => {
        await prepareData();
    });

    it('Returns 401 if no token provided', async () => {
        const result = await supertest(app).get('/orders');

        expect(result.status).toEqual(401);
        expect(result.body).toEqual({ message: 'Not logged in!' })
    });

    it('Returns 401 if invalid token provided', async () => {
        config.Authorization = `Bearer ${uuid()}`;
        const result = await supertest(app).post('/orders').set(config).send(order);

        expect(result.status).toEqual(401);
        expect(result.body).toEqual({ message: 'Not logged in!' })

    });

    it('Returns an array with the user orders information', async () => {
        const result = await supertest(app).get('/orders').set(config);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(expect.any(Array))

    });

    afterEach(async () => {
        await clearDatabase();
    });

});
    
afterAll(async () => {
    await connection.end(); 
});
