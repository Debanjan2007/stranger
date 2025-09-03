import  { Team } from '../model/teams.model.js'
import { asyncHandler } from '../utils/asynchandler.js'

export const TeamAlreadyExist = asyncHandler(async (req , res , next) => {
    try {
        const { teamName } = req.body;
        const team = await Team.findOne({ teamName });
        if(team){
            return res.json( { success: false, message: "Team name already exists" } );
        }
        req.team = teamName
        next();
    } catch (error) {
        if(error){
        console.error("error:", error);
            return res.json({ success: false, message: "Registration failed" , redirect: "/register" }); 
        }
    }
})
