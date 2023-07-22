
const pscale_read_url = process.env.PSCALE_WRITE_URL || "";

export default function checkDB_URL(req:any,res:any,next:any){
    if(pscale_read_url!==process.env.PSCALE_WRITE_URL){
        res.status(500).json({ err:"Internal server error", error_type:"faulty database connection" })
        return
    }
    next()
}