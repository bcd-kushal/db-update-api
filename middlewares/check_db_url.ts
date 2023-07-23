
const pscale_read_url = process.env.PSCALE_WRITE_URL || "";
const pscale_check_lock_url = process.env.PSCALE_CHECK_LOCK_URL || "";

export default function checkDB_URL(req:any,res:any,next:any){
    if(pscale_read_url!==process.env.PSCALE_WRITE_URL || pscale_check_lock_url!==process.env.PSCALE_CHECK_LOCK_URL){
        res.status(500).json({ err:"Internal server error", error_type:"faulty database connection" })
        return
    }
    next()
}