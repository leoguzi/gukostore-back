// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../../src/database.js';

export default async function createUser() {
  let userData = {
    name: faker.lorem.words(2),
    email: faker.internet.email().toLowerCase(),
    address: faker.lorem.words(50),
    password: '123456',
    passwordConfirmation: '123456',
    hashedPassword: bcrypt.hashSync('123456', 10)
  };

  const insertedUser = await connection.query(
    'INSERT INTO users (name, email, address, password) VALUES ($1, $2, $3, $4) RETURNING *;',
    [userData.name, userData.email, userData.address, userData.hashedPassword]
  );

  userData = { ...userData, id: insertedUser.rows[0].id };
  return userData;
}
