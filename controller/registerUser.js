import { asyncHandler } from '../utils/asynchandler.js'
import { User } from '../model/user.model.js'
import jwt from 'jsonwebtoken'

// register a user
const registerUser = asyncHandler(async (req , res) => {
    const { email , userName , password } = req.body ;
    try {        
        const UserExists = await User.findOne({ email });
        if(UserExists) {
            return res.json({ success: false, message: "User already exists" , redirect: "http://localhost:3000/?error=exists" });
        }
        const user = await User.create({ email, userName, password });      
        const refreshToken = await user.genRefreshToken(user._id);
        const accessToken = await user.genAccessToken();

        user.refreshToken = refreshToken;
        await user.save();
        
        return res.json({ success: true, render: "/homepage" , session: accessToken });
    } catch (error) {
        if(error){
        console.error("error:", error);
            return res.json({ success: false, message: "Registration failed" , redirect: "/register" }); 
        }
    }
})

export {
    registerUser
}