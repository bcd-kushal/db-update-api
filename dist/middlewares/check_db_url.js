"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pscale_read_url = process.env.PSCALE_WRITE_URL || "";
function checkDB_URL(req, res, next) {
    if (pscale_read_url !== process.env.PSCALE_WRITE_URL) {
        res.status(500).json({ err: "Internal server error", error_type: "faulty database connection" });
        return;
    }
    next();
}
exports.default = checkDB_URL;
