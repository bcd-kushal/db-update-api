import Express, { json } from "express"
import cluster from "cluster"
import cors from "cors"
import "dotenv/config"
import mysql from "mysql2/promise"
import os from "os";

//middlewares -----------------------------------------------------
import checkPORT from "./middlewares/check_port"
import checkRequestType from "./middlewares/check_request_type"
import checkDB_URL from "./middlewares/check_db_url"


const PORT = process.env.PORT || ""


// PLANETSCALE connections ----------------------------------
const pscale_read_url = process.env.PSCALE_WRITE_URL || "";
const pscale_check_lock_url = process.env.PSCALE_CHECK_LOCK_URL || "";

const pscale_conn = async () => {
    return await mysql.createConnection(pscale_read_url);
};
const lock_conn = async () => {
    return await mysql.createConnection(pscale_check_lock_url);
};

const conn = pscale_conn(); 
const islock_conn = lock_conn();
//           ^ this needs to be awaited but top-level await somwhow isnt transpiling to a successsful dockerized container







// inside cluster workers -------------------------------


const app = Express()

app.use(checkPORT)
app.use(checkRequestType)  //if GET then reject request

app.use(cors())
app.use(json())


app.post('/register', checkDB_URL, async (req,res) => {

    const { discordUID, genshinUID, region, ltoken, ltuid, cookie_token, password } = req.body

    const table_name = "RegisteredUsers"
    const [ disc_id, gen_id, reg, l_token, l_uid, cookie, pass ] = [ discordUID, genshinUID, region, ltoken, ltuid, cookie_token, password ]
    const field = 'isLocked'

    //if lock = 1 then exit else continue
    const checkLockQuery = `select ${field} from ${table_name} where discordUID=${disc_id}`
    const [lock_rows] = await (await islock_conn).query(checkLockQuery)

    const a = Object.values(JSON.parse(JSON.stringify(lock_rows)))

    res.status(200).json({ locked:a[0][field] })
    return

    const lock_status = 0

    //perfectly runs up till here
    
    
    const query = `insert into ${table_name}(discordUID,genshinUID,region,ltoken,ltuid,cookieToken, isLocked,password) values(${disc_id},${gen_id},'${reg}','${l_token}','${l_uid}','${cookie}','${lock_status}','${pass}')`

    const [rows] = await (await conn).query(query);/* 

    const responseObj = {
        msg:table_name,
        disc_id: disc_id,
        cook: cookie,
        GUID: gen_id,
        password: pass,
        maxCores: os.cpus().length
    } */
    res.status(200).json(rows)


    //res.status(200).json({ msg: `${req.method} request received at route: ${req.url}` })
})

app.patch('/',(req,res) => {
    res.status(200).json({ msg: `${req.method} request received` })
})

app.put('/',(req,res) => {
    res.status(200).json({ msg: `${req.method} request received` })
})

// ============================================================

app.listen(PORT, () => {
    console.log(`updation_API listening on server port ${PORT}`)
})

module.exports = app