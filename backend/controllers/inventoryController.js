const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const db = require('../config/db')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});
const upload = multer({ storage });

const uploadInventory = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        // insert data to db
        const insertQueries = data.map(item => {
            return db.query(
                'INSERT IGNORE INTO inventory (id, name, quantity, price) VALUES (?, ?, ?, ?)',
                [item.ID, item.Name, item.Quantity, item.Price]
            );
        });

        await Promise.all(insertQueries);

        res.json({ message: "successfully stored" });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Failed to process file" });
    }
};


const getInventory = (req, res) => {

    db.query('SELECT * FROM inventory', async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: "No data found or Error" });
        }
        res.status(201).json(results)

    })

};

const clearInventory = (req, res) => {
    db.query('DELETE FROM inventory', (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ message: "Failed to clear inventory data" });
        }
        res.json({ message: "Inventory data cleared successfully" });
    });
}


module.exports = { uploadInventory, upload, getInventory, clearInventory };
