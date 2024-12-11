const express = require("express");
const {webauthRegister,verifyWebauthRegister,webAuthLogin,verifyWebAuthLogin} = require('../controllers/webAuthController')

const router = express.Router();


router.post("/verify-register", verifyWebauthRegister);
router.get("/init-register", webauthRegister);

router.post("/verify-auth", verifyWebAuthLogin);
router.get("/init-auth", webAuthLogin);

module.exports = router;