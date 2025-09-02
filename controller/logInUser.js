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
    return res
    .json({ success: true , session: accessToken });
})

export {
    logInUser
}