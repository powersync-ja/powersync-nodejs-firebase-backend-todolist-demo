import app from "./app.js";
import config from "./config.js";

const PORT = config.port;

try {
    app.listen(PORT, () => {
        console.log(`Server is running @ http://127.0.0.1:${PORT}`);
    });
} catch (err) {
    console.log("[ERROR] Unexpected error", err);
}

