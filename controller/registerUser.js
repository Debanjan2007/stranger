import { asyncHandler } from '../utils/asynchandler.js'
import { User } from '../model/user.db.js'
import jwt from 'jsonwebtoken'
import { log } from 'node:console';

// register a user
const registerUser = asyncHandler(async (req , res) => {
    console.log(req.body);
    const { email , userName , password } = req.body ;
    try {
        console.log("registering...");
        
        const UserExists = await User.findOne({ email });
        console.log("UserExists:", UserExists);
        if(UserExists) {
            return res
            .status(400)
            // .redirect('http://localhost:3000?error=exists')
            .json({ error: 'exists' });
        }
        const user = await User.create({ email, userName, password });
        console.log(user);
        const userId = user._id ;
        console.log(userId);        
        const refreshToken = await user.genRefreshToken(userId);
        const accessToken = await user.genAccessToken();
        console.log("accessToken:", accessToken);
        console.log("decoded:", jwt.decode(accessToken));

        user.refreshToken = refreshToken;
        await user.save();
        return res
        .status(201)
        // .render('homepage.ejs')
        .json({ accessToken, refreshToken });
    } catch (error) {
        if(error){
        log("error:", error);
            return res
        .status(500)
        // .redirect('http://localhost:3000?error=internal')
        .json({ error: 'internal' });
        }
    }
})

export {
    registerUser
}