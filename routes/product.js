const express = require('express');
const router = express.Router();

app.get('/api/products', (req, res) => {
    res.json(products);
});

const products = [
    { id: 1, name: 'Men watches', price: 149 },
    { id: 2, name: 'Women watches', price: 249 },
    { id: 3, name: 'Classic watches', price: 349 },
    { id: 4, name: 'Modern watches', price: 599 },
];

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});