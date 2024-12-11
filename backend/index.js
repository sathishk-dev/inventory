const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const db = require("./config/db");
const authRoutes = require('./routes/authRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const webAuthRoutes = require('./routes/webAuthRoutes')

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

db.connect((err)=>{
    if(err){
        console.log("Database connection error: ",err.message);
    }
    else{
        console.log("Database Successfully connected")
    }
})


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/webauthn", webAuthRoutes);
app.use("/api/inventory", inventoryRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});