"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const promise_1 = __importDefault(require("mysql2/promise"));
//middlewares -----------------------------------------------------
const check_port_1 = __importDefault(require("./middlewares/check_port"));
const check_request_type_1 = __importDefault(require("./middlewares/check_request_type"));
const check_db_url_1 = __importDefault(require("./middlewares/check_db_url"));
const PORT = process.env.PORT || "";
// PLANETSCALE connections ----------------------------------
const pscale_read_url = process.env.PSCALE_WRITE_URL || "";
const pscale_conn = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield promise_1.default.createConnection(pscale_read_url);
});
const conn = pscale_conn();
//           ^ this needs to be awaited but top-level await somwhow isnt transpiling to a successsful dockerized container
// inside cluster workers -------------------------------
const app = (0, express_1.default)();
app.use(check_port_1.default);
app.use(check_request_type_1.default); //if GET then reject request
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.post('/register', check_db_url_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { discordUID, genshinUID, region, ltoken, ltuid, cookie_token, password } = req.body;
    const table_name = "RegisteredUsers";
    const [disc_id, gen_id, reg, l_token, l_uid, cookie, pass] = [discordUID, genshinUID, region, ltoken, ltuid, cookie_token, password];
    const query = `insert into ${table_name}(discordUID,genshinUID,region,ltoken,ltuid,cookieToken,password) values(${disc_id},${gen_id},${reg},${l_token},${l_uid},${cookie},${pass})`;
    const [rows] = yield (yield conn).query(query);
    res.status(200).json(rows);
    //res.status(200).json({ msg: `${req.method} request received at route: ${req.url}` })
}));
app.patch('/', (req, res) => {
    res.status(200).json({ msg: `${req.method} request received` });
});
app.put('/', (req, res) => {
    res.status(200).json({ msg: `${req.method} request received` });
});
// ============================================================
app.listen(PORT, () => {
    console.log(`updation_API listening on server port ${PORT}`);
});
module.exports = app;
