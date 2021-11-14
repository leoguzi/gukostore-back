import connection from '../database.js';

const productsQuery = 'SELECT * FROM products';
const imagesQuery = 'SELECT * FROM images'
const categoriesQuery = `SELECT product_category.id_product,
                            categories.name
                          FROM product_category 
                            JOIN categories
                              ON product_category.id_category = categories.id`;

async function getProducts(req, res) {
  try {
    const products = await connection.query(`${productsQuery};`);
    const categories = await connection.query(`${categoriesQuery};`);
    const images = await connection.query(`${imagesQuery};`);

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

    return res.status(200).send(productsArray);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function productById(req, res) {
  const { id } = req.params;
  try {
    let product = await connection.query(`${productsQuery} WHERE id=$1;`, [id]);
    const images = await connection.query(`${imagesQuery} WHERE id_product=$1;`, [id]);
    const categories = await connection.query(`${categoriesQuery} WHERE product_category.id_product=$1;`, [id])
    product = {
      ...product.rows[0],
      images: images.rows.map((image) => image.url),
      categories: categories.rows.map((category => category.name))
    }
    res.status(200).send(product);
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

export { getProducts, productById, searchProducts };
