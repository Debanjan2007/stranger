import express from "express";

const router = express.Router() ;

router.get('/' , (req , res) => {
    res.writeHead(200 , {'Content-Type' : 'text/html'});
    res.end('Hello World!')
})
router.get('/chat' , (req , res) => {
    
})
export {
    router
}