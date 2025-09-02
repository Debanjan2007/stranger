import { User } from '../model/user.model.js'
import { asyncHandler } from '../utils//asynchandler.js'

// Log in a user 
const logInUser = asyncHandler(async (req , res) => {
    const { email , password} = req.body
    const user = await User.findOne({ email })
    const pass = await user.isPasswordMatched(password)
    if(!pass){
        return res
        .json({ success: false, error: "unauthorized" })
    }
    const accessToken = await user.genAccessToken()
    const refreshToken = await user.genRefreshToken(user._id)

    user.refreshToken = refreshToken ;    
    await user.save() ;
    res.cookie('session' , accessToken , {
            httpOnly: false, 
            secure: false, // not using https
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // max time 1 day
        })
    return res
    .json({ success: true });
})

export {
    logInUser
}