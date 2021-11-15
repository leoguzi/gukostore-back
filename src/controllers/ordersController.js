import connection from '../database.js';
import orderSchema from '../schemas/orderSchema.js'

async function postOrder(req, res) {
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        
        return res.status(401).send({ message: 'Not logged in!' });
        
    }
    if (orderSchema.validate(req.body).error) {
        return res.status(400).send({message: 'Invalid body!'})
    }
    try {
        const session = await connection.query(`SELECT * FROM sessions WHERE token =$1;`, [token]);
        if (session.rowCount === 0) {
            return res.status(401).send({ message: 'Not logged in!' });
        }
        const { cardNumber, products } = req.body
        const order = await connection.query(`
                            INSERT INTO orders (id_user, card_number)
                                VALUES ($1, $2) RETURNING id;`,
            [session.rows[0].id_user, cardNumber]);
        products.forEach(async (product) => {
            const { idProduct, quantity } = product
            await connection.query(`INSERT INTO order_product (id_product, id_order, quantity) VALUES ($1, $2, $3);`,
                [idProduct, order.rows[0].id, quantity]);
        });
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
    
}

async function getOrders(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ message: 'Not logged in!' });
    }
    try {
        const session = await connection.query(`SELECT * FROM sessions WHERE token =$1;`, [token]);
        if (session.rowCount === 0) {
            return res.status(401).send({ message: 'Not logged in!' });
        }

        const orders = await connection.query(`SELECT * FROM orders WHERE id_user =$1;`,
            [session.rows[0].id_user]);
        
        const userOrders = [];
        
        for (let i = 0; i < orders.rowCount; i += 1) {
            /* eslint-disable no-await-in-loop */
            const itens = await connection.query(`
                SELECT products.name,
                products.price,
                order_product.id_product,
                order_product.quantity 
                    FROM products
                        JOIN order_product
                            ON products.id = order_product.id_product
                            WHERE id_order=$1;`,
                [orders.rows[i].id]);
            userOrders.push({ id: orders.rows[i].id, itens: itens.rows });
        }
         return res.status(200).send(userOrders);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }


}

export { postOrder, getOrders } ;