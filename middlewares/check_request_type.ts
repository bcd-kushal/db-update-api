

export default function checkRequestType(req:any,res:any,next:any){
    if(req.method === 'GET'){
        res.status(403).json({ err: "GET requests are not allowed using this route" })
        return
    }
    next()
}

