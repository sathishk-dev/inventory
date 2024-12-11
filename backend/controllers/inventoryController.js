const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const db = require('../config/db');
const util = require('util');

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

        if (!data || data.length === 0) {
            return res.status(400).json({ message: "file is empty" });
        }

        const transformedData = data.map(row => {
            const transformedRow = {};
            for (const key in row) {
                transformedRow[key.toLowerCase()] = row[key];
            }
            return transformedRow;
        });

        const columnNames = Object.keys(transformedData[0]);
        const query = util.promisify(db.query).bind(db);

        let columns;
        try {
            columns = await query('SHOW COLUMNS FROM inventory');
        } 
        catch (err) {
            return res.status(500).json({ message: "Error fetch columns from db" });
        }

        const existColumn = columns.map(col => col.Field);

        for (const columnName of columnNames) {
            if (!existColumn.includes(columnName)) {
                const alterQuery = `ALTER TABLE inventory ADD COLUMN \`${columnName}\` VARCHAR(255)`;
                await query(alterQuery);
            }
        }

        for (const item of transformedData) {

            const columns = columnNames.join(",");
            const placeholders = columnNames.map(() => "?").join(",");
            const values = columnNames.map(col => item[col]);

            // console.log(columns,placeholders,values)

            const insertQuery = `
                INSERT INTO inventory (${columns}) 
                VALUES (${placeholders}) 
                ON DUPLICATE KEY UPDATE ${columnNames.map(col => `\`${col}\` = VALUES(\`${col}\`)`).join(", ")}
            `;

            await query(insertQuery, values);
        }

        res.json({ message: "Successfully stored " });
    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({ message: "Error uploading file:" });
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
