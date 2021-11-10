import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import createUser from '../tests/factories/userFactory.js';
import connection from '../src/database.js';

async function clearDatabase() {
  await connection.query('DELETE FROM sessions;');
  await connection.query('DELETE FROM users;');
}

let newUser;

describe('POST /signin', () => {
  beforeEach(async () => {
    newUser = await createUser();
  });

  afterAll(async () => {
    connection.end();
  });

  it('Returns 401 if wrong password', async () => {
    const result = await supertest(app)
      .post('/signin')
      .send({ email: newUser.email, password: 'wrongpswd' });

    expect(result.status).toEqual(401);
  });

  it('Returns 200 if logged in sucessfully', async () => {
    const result = await supertest(app)
      .post('/signin')
      .send({ email: newUser.email, password: newUser.password });
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      name: newUser.name,
      token: expect.any(String),
    });
  });

  it('Creates a session in the database', async () => {
    await supertest(app)
      .post('/signin')
      .send({ email: newUser.email, password: newUser.password });
    const session = await connection.query(
      'SELECT * FROM sessions WHERE id_user = $1;',
      [newUser.id]
    );
    expect(session.rowCount).toEqual(1);
  });

  afterEach(async () => {
    await clearDatabase();
  });
});
