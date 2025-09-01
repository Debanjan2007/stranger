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
export {
    router
}