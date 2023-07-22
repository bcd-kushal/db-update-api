"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkRequestType(req, res, next) {
    if (req.method === 'GET') {
        res.status(403).json({ err: "GET requests are not allowed using this route" });
        return;
    }
    next();
}
exports.default = checkRequestType;
