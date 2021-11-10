import connection from '../database.js';

async function getProducts(req, res) {
  try {
    const products = await connection.query(
      'SELECT id, name, price FROM products;'
    );
    const categories = await connection.query(`
      SELECT product_category.id_product,
      categories.name
      FROM product_category 
        JOIN categories
          ON product_category.id_category = categories.id;`);

    const images = await connection.query('SELECT * FROM images;');

    const productsArray = products.rows.map((product) => {
      const completeProduct = { ...product, images: [], categories: [] };
      categories.rows.forEach((category) => {
        if (category.id_product === product.id) {
          completeProduct.categories.push(category.name);
        }
      });
      images.rows.forEach((image) => {
        if (image.id_product === product.id) {
          completeProduct.images.push(image.url);
        }
      });
      return completeProduct;
    });
    res.status(200).send(productsArray);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function searchProducts(req, res) {
  try {
    res.status(200).send({ message: 'sucess!' });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { getProducts, searchProducts };
