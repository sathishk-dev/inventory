const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require("@simplewebauthn/server")
const db = require('../config/db')

if (!globalThis.crypto) {
    const { webcrypto, verify } = require('node:crypto');
    globalThis.crypto = webcrypto;
}

const RP_ID = "localhost"
const CLIENT_URL = process.env.CLIENT_URL

const webauthRegister = async (req, res) => {
    const email = req.query.email
    if (!email) {
        return res.status(400).json({ error: "Email is required" })
    }
    try {
        db.query('SELECT * FROM webauthn_credentials WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (results.length > 0) {
                return res.status(400).json({ message: "User already exists", isAlredyReg: true });
            }
            const options = await generateRegistrationOptions({
                rpID: RP_ID,
                rpName: "Inventory",
                userName: email,
            })

            res.cookie(
                "regInfo",
                JSON.stringify({
                    userId: options.user.id,
                    email,
                    challenge: options.challenge,
                }),
                { httpOnly: true, maxAge: 60000, secure: true }
            )

            res.json(options)
        })
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const verifyWebauthRegister = async (req, res) => {
    const regInfo = JSON.parse(req.cookies.regInfo)

    if (!regInfo) {
        return res.status(400).json({ error: "Registration info not found" })
    }

    const verification = await verifyRegistrationResponse({
        response: req.body,
        expectedChallenge: regInfo.challenge,
        expectedOrigin: CLIENT_URL,
        expectedRPID: RP_ID,
    })

    if (verification.verified) {

        const PublicKeyBase64 = Buffer.from(verification.registrationInfo.credentialPublicKey).toString('base64');
        res.cookie('credentialPublicKey', PublicKeyBase64, {
            httpOnly: true,
            secure: true,
            maxAge: 360000, 
        });


        const query = `
                    INSERT INTO webauthn_credentials 
                    (user_id, email, key_id, public_key, counter, device_type, backed_up, transport) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;

        const values = [
            regInfo.userId,
            regInfo.email,
            verification.registrationInfo.credentialID,
            PublicKeyBase64,
            verification.registrationInfo.counter,
            verification.registrationInfo.credentialDeviceType,
            verification.registrationInfo.credentialBackedUp,
            JSON.stringify(req.body.transports),
        ];

        await db.query(query, values);

        res.clearCookie("regInfo")
        return res.json({ verified: verification.verified })
    } else {
        return res
            .status(400)
            .json({ verified: false, error: "Verification failed" })
    }
};


const webAuthLogin = async (req, res) => {
    const email = req.query.email
    if (!email) {
        return res.status(400).json({ error: "Email is required" })
    }

    try {
        db.query('SELECT * FROM webauthn_credentials WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });

            if (results == null) {
                return res.status(400).json({ error: "No user for this email" });
            }
            const user = results[0];
            // console.log(user.key_id)

            const options = await generateAuthenticationOptions({
                rpID: RP_ID,
                allowCredentials: [
                    {
                        id: user.key_id,
                        type: "public-key",
                        transports: Array.isArray(user.transport) ? user.transport : [user.transport],
                    },
                ],
            })

            res.cookie(
                "authInfo",
                JSON.stringify({
                    userId: user.user_id,
                    challenge: options.challenge,
                }),
                { httpOnly: true, maxAge: 60000, secure: true }
            )

            res.json(options)
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
        console.log(err)
    }
}

const verifyWebAuthLogin = async (req, res) => {
    const authInfo = JSON.parse(req.cookies.authInfo)

    if (!authInfo) {
        return res.status(400).json({ error: "Authentication info not found" })
    }

    try {
        db.query('SELECT * FROM webauthn_credentials WHERE user_id = ?', [authInfo.userId], async (err, results) => {
            const user = results[0];
            if (user == null || user.key_id != req.body.id) {
                return res.status(400).json({ error: "Invalid user" })
            }

            const publicKeyBase64 = user.public_key;
            // const publicKeyBase64 = req.cookies.credentialPublicKey;
            const publicKeyBuffer = Buffer.from(publicKeyBase64, 'base64');
            const publicKeyArray = new Uint8Array(publicKeyBuffer);

            const verification = await verifyAuthenticationResponse({
                response: req.body,
                expectedChallenge: authInfo.challenge,
                expectedOrigin: CLIENT_URL,
                expectedRPID: RP_ID,
                authenticator: {
                    credentialID: user.key_id,
                    credentialPublicKey: publicKeyArray,
                    counter: user.counter,
                    transports: Array.isArray(user.transport) ? user.transport : [user.transport],
                }
            })

            if (verification.verified) {

                const query = `
                            UPDATE webauthn_credentials
                            SET counter = ?
                            WHERE user_id = ?;
                        `;

                const values = [verification.authenticationInfo.newCounter, user.user_id];

                db.query(query, values, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: "Error updating counter" });
                    }
                    res.clearCookie("authInfo")
                    return res.json({ verified: verification.verified })
                });
            } else {
                return res
                    .status(400)
                    .json({ verified: false, error: "Verification failed" })
            }

        });

    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
        console.log(err)
    }
}


module.exports = { webauthRegister, verifyWebauthRegister, webAuthLogin, verifyWebAuthLogin }