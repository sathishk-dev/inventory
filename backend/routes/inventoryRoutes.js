const express = require("express");
const router = express.Router();
const { upload, uploadInventory, getInventory,clearInventory } = require("../controllers/inventoryController");

router.post("/upload", upload.single("file"), uploadInventory);
router.get("/getInventory", getInventory);
router.delete("/clear", clearInventory);

module.exports = router;
