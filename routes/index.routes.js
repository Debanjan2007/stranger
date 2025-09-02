import express from "express";
import multer from "multer";
import { registerUser } from "../controller/registerUser.js";
import { logInUser } from "../controller/logInUser.js"
import { unAuthorisedHandler } from '../middleware/unauthorisedHandler.js'
import { verifyJwt } from '../middleware/jwt.Verify.js'
import { createTeamHandler }  from '../controller/createteam.js'

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
router.get('/create-room' , 
    unAuthorisedHandler,
    (req , res) => {
        res.render('create-room.ejs');
})
router.post('/create-room', 
    verifyJwt,
    createTeamHandler
)
export {
    router
}