import jwt from 'jsonwebtoken'
import { User } from '../model/user.model.js'
import { Team } from '../model/teams.model.js'
import { asyncHandler } from './asynchandler.js';
import mongoose from 'mongoose';

const joinUser = asyncHandler(async (teamName , token) => {    
    try {
        if(!token){
            return res.json({ success: false, message: "Wrong token or no token" , redirect: "/register" }); 
        }
        const { id } = jwt.verify(token , process.env.JWT_REFRESH_SECRET);
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.json({ success: false, message: "Wrong token or no token" , redirect: "/register" }); 
        }
        if(!teamName){
            return res.redirect('/user/chats')
        }
        const { UID } = await Team.findOne({teamName : teamName})
        await User.findByIdAndUpdate(id,
                {
                    $addToSet:{
                        teams: { UID: UID, role: 'member' }
                    }
                },
                {
                    new: true
                }
        )
        await Team.findOneAndUpdate({UID : UID}, 
            {
                $addToSet: {
                    members: id
                }
            },
            {
                new: true
            }
        )
    } catch (error) {
        console.log(error);
        return ;        
    }
})
export {
    joinUser
}