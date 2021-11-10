import Joi from 'joi';
import bcrypt from 'bcrypt';
import connection from '../database.js';

async function postSignup(req, res) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    passwordConfirmation: Joi.string().min(5).required(),
  });

  const value = schema.validate(req.body);
  const { name, email, address, password, passwordConfirmation } = req.body;

  if (password !== passwordConfirmation) {
    return res.sendStatus(400);
  }

  const result = await connection.query(
    `  
  SELECT * FROM users WHERE email = $1 
  `,
    [email]
  );

  if (result.rows.length > 0) {
    return res.sendStatus(409);
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 11);
    await connection.query(
      `INSERT INTO users
        (name, email, password, address) 
        VALUES ($1, $2, $3, $4)`,
      [name, email, passwordHash, address]
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export { postSignup };
