import jwt from 'jsonwebtoken'
import { User } from '../model/user.model'
import { Team } from '../model/teams.model'
import { asyncHandler } from './asynchandler';

function joinUser(roomName , token){
    asyncHandler(async function (){
    const { id } = jwt.verify(token);
    const roomId = await Team.findOne({roomName}).select("+UID")
    console.log(roomId);
    await User.findByIdAndUpdate(id,
            {
                $addToSet:{
                    teams: { UID: roomId, role: 'member' }
                }
            },
            {
                new: true
            }
    )
    await Team.findOne(roomId , 
        {
            $addToSet: {
                members: roomId
            }
        },
        {
            new: true
        }
    )
})
} 

export {
    joinUser
}