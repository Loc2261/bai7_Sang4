const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
}, { timestamps: true, _id: false });

// Post-save hook to create inventory
productSchema.post('save', async function(doc, next) {
    try {
        const Inventory = mongoose.model('Inventory');
        await Inventory.create({
            product: doc._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });
        console.log(`Inventory created for product ID: ${doc._id}`);
    } catch (error) {
        console.error(`Error creating inventory: ${error.message}`);
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
