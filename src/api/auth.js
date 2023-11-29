import express from "express";
import {SignJWT, importJWK} from "jose";
import {initializeApp, applicationDefault} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import config from "../../config.js";

/**
 * Set the Router for all /auth endpoints
 * @type {Router}
 */
const router = express.Router();

/**
 * Initialize the Firebase app
 */
const firebaseApp = initializeApp({
    credential: applicationDefault()
});

/**
 * Get the Auth context fot the initialized app
 * @type {Auth}
 */
const appAuth = getAuth(firebaseApp);

/**
 * Get the JWT token that PowerSync will use to authenticate the user
 */
router.get("/token", async (req, res) => {
    try {
        if(!req.headers.authorization) {
            res.status(401).send();
            return;
        }
        // Here, we assume the Authorization header format is: Bearer YOUR_TOKEN
        const userToken = req.headers.authorization.split(' ')[1];
        if(!userToken) {
            res.status(401).send();
            return;
        }
        // Verify the token with Firebase
        const decodedToken = await appAuth.verifyIdToken(userToken);

        console.log(decodedToken);

        if(decodedToken) {
            // If token is valid, decodedToken has all the user info
            const uid = decodedToken.uid;

            const decodedPrivateKey= new Buffer.from(config.powersync.privateKey, 'base64');
            const powerSyncPrivateKey = JSON.parse(new TextDecoder().decode(decodedPrivateKey));
            const powerSyncKey = await importJWK(powerSyncPrivateKey);
            const token = await new SignJWT({})
                .setProtectedHeader({
                    alg: powerSyncPrivateKey.alg,
                    kid: powerSyncPrivateKey.kid,
                })
                .setSubject(uid)
                .setIssuedAt()
                .setIssuer(config.powersync.jwtIssuer)
                .setAudience(config.powersync.url)
                .setExpirationTime('5m')
                .sign(powerSyncKey);

            const responseBody = {
                token: token,
                powerSyncUrl: config.powersync.url,
                expiresAt: null,
                userId: uid
            };

            console.log(token);

            res.send(responseBody);
        } else {
            res.status(401).send({
                message: "Unable to verify Firebase idToken"
            });
        }
    } catch (err) {
        console.log("[ERROR] Unexpected error", err);
        res.status(500).send({
            message: err.message
        });
    }
});

/**
 * This is the JWKS endpoint PowerSync uses to handle authentication
 */
router.get("/keys", (req, res) => {
    try {
        const decodedPublicKey= new Buffer.from(config.powersync.publicKey, 'base64');
        const powerSyncPublicKey = JSON.parse(new TextDecoder().decode(decodedPublicKey));
        res.send({
            keys: [
                powerSyncPublicKey
            ]
        });
    } catch (err) {
        console.log("[ERROR] Unexpected error", err);
        res.status(500).send({
            message: err.message
        });
    }
});

export { router as authRouter };
