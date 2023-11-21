import express from "express";
import pg from "pg";
import config from "../../config.js";

const {Pool} = pg;

const router = express.Router();

const pool = new Pool({
    host: config.database.host,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
});

/**
 * Handle error events for PostgresSQL
 */
pool.on('error', (err, client) => {
    console.error("Pool connection failure to postgres:", err, client);
})

/**
 * Handle all PUT events sent to the server by the client PowerSunc application
 */
router.put("/", async (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "Invalid body provided"
        });
        return;
    }

    // The table which needs to be updated
    const table = req.body.table;
    // The data of the object
    const data = req.body.data;

    await upsert(table, data);

    res.status(200).send({
        message: `PUT completed for ${table} ${data.id}`
    })
});

/**
 * Handle all PATCH events sent to the server by the client PowerSunc application
 */
router.patch("/", async (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "Invalid body provided"
        });
        return;
    }

    // The table which needs to be updated
    const table = req.body.table;
    // The data of the object
    const data = req.body.data;

    await upsert(table, data);

    res.status(200).send({
        message: `PATCH completed for ${table} ${data.id}`
    })
});

/**
 * Handle all DELETE events sent to the server by the client PowerSunc application
 */
router.delete("/", async (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "Invalid body provided"
        });
        return;
    }

    // The table which needs to be updated
    const table = req.body.table;
    // The data of the object
    const data = req.body.data;
    /**
     * TODO: Implement your delete event with the DB here
     */
    res.status(200).send({
        message: `PUT completed for ${table} ${data.id}`
    })
});

/**
 * Upsert a record in the specified table
 * @param table
 * @param data
 * @returns {Promise<void>}
 */
const upsert = async (table, data) => {
    /**
     * TODO: Implement your delete event with the DB here
     */
}

export { router as dataRouter };
