import express from "express";
import multer from "multer";
import { registerUser } from "../controller/registerUser.js";
import { logInUser } from "../controller/logInUser.js"
const router = express.Router() ;

const uploader = multer() ;

// render the register page
router.get('/register', (req, res) => {
    res.render('register.ejs');
})
// creates a user 
router.post('/register' , 
    uploader.none(),
    registerUser
)
router.post('/login', 
    uploader.none(),
    logInUser
)
router.get('/create-room' , (req , res) => {
    console.log(req.cookies);
    const session = req.session;
    console.log(session);
    if (!session) {
        return res.redirect("http://localhost:3000/?error=unauthorized");
    }
    res.render('create-room.ejs');
})
export {
    router
}