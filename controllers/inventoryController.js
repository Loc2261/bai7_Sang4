const Inventory = require('../models/inventory');

exports.getAllInventory = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json(inventories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOneAndUpdate(
            { product },
            { $inc: { stock: quantity } },
            { new: true, runValidators: true }
        );
        if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
        
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        
        inventory.stock -= quantity;
        await inventory.save();
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.reservation = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
        
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock for reservation' });
        }
        
        inventory.stock -= quantity;
        inventory.reserved += quantity;
        await inventory.save();
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sold = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
        
        if (inventory.reserved < quantity) {
            return res.status(400).json({ message: 'Insufficient reserved quantity' });
        }
        
        inventory.reserved -= quantity;
        inventory.soldCount += quantity;
        await inventory.save();
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
