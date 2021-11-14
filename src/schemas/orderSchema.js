import joi from 'joi';

const orderSchema = joi.object(
    {
        cardNumber: joi.number().required(),
        products: joi.array().items(
            joi.object(
                {
                idProduct: joi.number().min(1).required(),
                quantity: joi.number().min(1).required()
            }))
    });

export default orderSchema;