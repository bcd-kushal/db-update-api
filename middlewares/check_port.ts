
const PORT = process.env.PORT || ""

export default function checkPORT(req: any, res: any, next: any){
    if(PORT!==process.env.PORT){
        res.status(500).json({ err: "Internal server error", error_type: "port mismatch" })
        return
    }
    next()
}
/* 
module.exports = {
    checkPORT
} */