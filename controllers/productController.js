const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    try {
        const { _id, name, price, description } = req.body;
        const product = new Product({ _id, name, price, description });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
