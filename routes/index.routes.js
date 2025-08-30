import express from "express";

const router = express.Router() ;

router.get('/user/chat' , (req , res) => {
    
})
router.get('/register', (req, res) => {
    res.render('register.ejs');
})
export {
    router
}