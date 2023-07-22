"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = process.env.PORT || "";
function checkPORT(req, res, next) {
    if (PORT !== process.env.PORT) {
        res.status(500).json({ err: "Internal server error", error_type: "port mismatch" });
        return;
    }
    next();
}
exports.default = checkPORT;
/*
module.exports = {
    checkPORT
} */ 
