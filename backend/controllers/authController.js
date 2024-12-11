const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Register
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json({ message: "Database error" });
            
            if (results.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashPassword], (err) => {
                if (err) return res.status(500).json({ message: "Database error" });
                res.status(201).json({ message: "Registered successfully" , userEmail:email });
            });
        });
    } 
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login
const loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token});
    });
};

module.exports = {registerUser,loginUser}