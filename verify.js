const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function verify() {
    try {
        console.log('--- 1. Creating Product ---');
        const productRes = await axios.post(`${BASE_URL}/products`, {
            name: 'Samsung Galaxy S24',
            price: 1000,
            description: 'Latest flagship'
        });
        const productId = productRes.data._id;
        console.log('Product Created:', productRes.data);

        // Wait a bit for the post-save hook to finish (though it's usually fast)
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('\n--- 2. Getting All Inventory ---');
        const inventoryRes = await axios.get(`${BASE_URL}/inventory`);
        console.log('Inventories:', JSON.stringify(inventoryRes.data, null, 2));

        const inventoryId = inventoryRes.data.find(inv => inv.product._id === productId)._id;

        console.log('\n--- 3. Adding Stock (Quantity: 100) ---');
        const addStockRes = await axios.post(`${BASE_URL}/inventory/add-stock`, {
            product: productId,
            quantity: 100
        });
        console.log('After Add Stock:', addStockRes.data);

        console.log('\n--- 4. Removing Stock (Quantity: 20) ---');
        const removeStockRes = await axios.post(`${BASE_URL}/inventory/remove-stock`, {
            product: productId,
            quantity: 20
        });
        console.log('After Remove Stock:', removeStockRes.data);

        console.log('\n--- 5. Reservation (Quantity: 10) ---');
        const reservationRes = await axios.post(`${BASE_URL}/inventory/reservation`, {
            product: productId,
            quantity: 10
        });
        console.log('After Reservation:', reservationRes.data);

        console.log('\n--- 6. Sold (Quantity: 5) ---');
        const soldRes = await axios.post(`${BASE_URL}/inventory/sold`, {
            product: productId,
            quantity: 5
        });
        console.log('After Sold:', soldRes.data);

        console.log('\n--- Verification Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('Verification Failed:', err.response ? err.response.data : err.message);
        process.exit(1);
    }
}

verify();
