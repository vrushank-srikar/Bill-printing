// Required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Initialize app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Default shop details
const shopDetails = {
    name: "My Shop",
    address: "123 Market Street, City",
    phone: "123-456-7890"
};

// Directory for storing bill data
const dataDir = path.join('D:\\BillData'); // Changed path to local disk
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Routes

// Home page
app.get('/', (req, res) => {
    res.render('home', { shopDetails });
});

// New bill page
app.get('/new-bill', (req, res) => {
    res.render('newBill', { shopDetails });
});

// Save bill and redirect to print
app.post('/save-bill', (req, res) => {
    const { customerName, customerPhone, products } = req.body;
    const billDate = new Date();
    const monthYear = `${billDate.getMonth() + 1}-${billDate.getFullYear()}`;
    const billId = `${Date.now()}`;

    // Bill data
    const billData = {
        id: billId,
        date: billDate,
        customerName,
        customerPhone,
        products,
        totalAmount: products.reduce((sum, p) => sum + p.price * p.quantity, 0)
    };

    // Ensure monthly file exists
    const filePath = path.join(dataDir, `${monthYear}.json`);
    let fileData = [];
    if (fs.existsSync(filePath)) {
        fileData = JSON.parse(fs.readFileSync(filePath));
    }
    fileData.push(billData);
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

    res.redirect(`/print-bill/${billId}`);
});

// Print bill page
app.get('/print-bill/:id', (req, res) => {
    const { id } = req.params;
    const files = fs.readdirSync(dataDir);

    let bill = null;
    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dataDir, file)));
        bill = data.find(b => b.id === id);
        if (bill) break;
    }

    if (!bill) return res.status(404).send('Bill not found');

    res.render('printBill', { shopDetails, bill });
});

// CRUD operations for bills

// View all bills (filtered by month/year)
app.get('/bills', (req, res) => {
    const { month, year } = req.query;
    const files = fs.readdirSync(dataDir);

    let bills = files.flatMap(file => JSON.parse(fs.readFileSync(path.join(dataDir, file))));

    if (month && year) {
        bills = bills.filter(bill => {
            const billDate = new Date(bill.date);
            return (
                billDate.getMonth() + 1 === parseInt(month) && // Month is 1-indexed
                billDate.getFullYear() === parseInt(year)
            );
        });
    }

    res.render('allBills', { shopDetails, bills, selectedMonth: month, selectedYear: year });
});

// Edit bill
app.get('/edit-bill/:id', (req, res) => {
    const { id } = req.params;
    const files = fs.readdirSync(dataDir);

    let bill = null;
    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dataDir, file)));
        bill = data.find(b => b.id === id);
        if (bill) break;
    }

    if (!bill) return res.status(404).send('Bill not found');

    res.render('editBill', { shopDetails, bill });
});

// Update bill
app.post('/update-bill/:id', (req, res) => {
    const { id } = req.params;
    const { customerName, customerPhone, products } = req.body;

    const files = fs.readdirSync(dataDir);
    for (const file of files) {
        const filePath = path.join(dataDir, file);
        const data = JSON.parse(fs.readFileSync(filePath));
        const billIndex = data.findIndex(b => b.id === id);

        if (billIndex !== -1) {
            data[billIndex] = { ...data[billIndex], customerName, customerPhone, products };
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            break;
        }
    }

    res.redirect(`/print-bill/${id}`);
});

// Delete bill
app.post('/delete-bill/:id', (req, res) => {
    const { id } = req.params;

    const files = fs.readdirSync(dataDir);
    for (const file of files) {
        const filePath = path.join(dataDir, file);
        let data = JSON.parse(fs.readFileSync(filePath));
        const updatedData = data.filter(b => b.id !== id);

        if (data.length !== updatedData.length) {
            fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
            break;
        }
    }

    res.redirect('/bills');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});