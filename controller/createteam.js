import { asyncHandler } from "../utils/asynchandler.js";
import { Team } from "../model/teams.model.js"
import { User } from "../model/user.model.js";

export const createTeamHandler = asyncHandler(async (req, res) => {
    try {
        const teamName = req.team;
        const userID = req.user.id;
        const currentTime = Date.now()
        const team = await Team.create({
            teamName: teamName,
            members: [userID],
            admins: [userID],
            lastOpen: currentTime
        })
        if (!team) {
            return res.json({ success: false, message: "Team creation failed" });
        }
        
        await User.findByIdAndUpdate(userID,
            {
                $addToSet:{
                    teams: { UID: team.UID, role: 'admin' }
                }
            },
            {
                new: true
            }
        )
        return res.json({ success: true, team , message: "Team created successfully" });
    } catch (error) {
        if(error){
            console.error("error:", error);
            return res.json({ success: false, message: "Registration failed" , redirect: "/register" }); 
        }
    }
})