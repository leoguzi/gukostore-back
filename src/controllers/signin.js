import Joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database.js';
import app from '../app.js';

async function postSignin(req, res) {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'com.br'] },
      })
      .required(),
    password: Joi.string().min(5).required(),
  });

  try {
    const value = await schema.validateAsync(req.body);
    const { email, password } = req.body;
    const result = await connection.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email]
    );
    const user = result.rows[0];

    const loginUser = await connection.query(
      `
        SELECT * FROM users
        JOIN sessions 
        ON users.id = sessions.id_user
        WHERE email = $1
    `,
      [email]
    );

    if (loginUser.rows.length) {
      await connection.query(
        `
          DELETE FROM sessions WHERE id = $1
        `,
        [loginUser.rows[0].id]
      );
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();

      await connection.query(
        `
          INSERT INTO sessions 
          (token, id_user) 
          VALUES ($1, $2)
        `,
        [token, user.id]
      );
      res.send({ token, name: user.name }).status(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export { postSignin };
