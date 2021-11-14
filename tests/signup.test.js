import '../src/setup.js';
import bcrypt from 'bcrypt';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

describe('POST /signup', () => {
  beforeAll(async () => {
    const hashPassword = bcrypt.hashSync('123456', 10);
    await connection.query(
      `INSERT INTO users (name, email, password, address) VALUES ('Test Test','testtest@driven.com', $1, 'Rua Driven Education, 123');`,
      [hashPassword]
    );
  });

  afterAll(async () => {
    await connection.query(`
      DELETE FROM users;`);
    connection.end();
  });

  it('returns 400 for invalid password confirmation', async () => {
    const body = {
      name: 'Test Test',
      email: 'testtest@driven.com',
      address: 'Rua Driven Education, 123',
      password: 'test123',
      passwordConfirmation: 'test1234'
    };

    const result = await supertest(app).post('/signup').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns 409 for email already registered', async () => {
    const body = {
      name: 'Test Test',
      email: 'testtest@driven.com',
      address: 'Rua Driven Education, 123',
      password: 'test123',
      passwordConfirmation: 'test123'
    };

    const result = await supertest(app).post('/signup').send(body);
    expect(result.status).toEqual(409);
  });

  it('returns 201 when the registration is done correctly', async () => {
    const body = {
      name: 'Test Correct',
      email: 'testcorrect@driven.com',
      address: 'Rua Driven Education, 123',
      password: 'test321',
      passwordConfirmation: 'test321'
    };

    const result = await supertest(app).post('/signup').send(body);
    expect(result.status).toEqual(201);
  });
});
