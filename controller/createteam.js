import { asyncHandler } from "../utils/asynchandler.js";
import { Team } from "../model/teams.model.js"
import { User } from "../model/user.model.js";

export const createTeamHandler = asyncHandler(async (req, res) => {
    const { teamName } = req.body;
    const userID = req.user.id;
    const team = await Team.create({
        teamName: teamName,
        members: [userID]
    })
    if (!team) {
        return res.json({ success: false, message: "Team creation failed" });
    }
    await User.findByIdAndUpdate(userID,
        {
            $addToSet:
                { teams: team.UID }
        },
        {
            new: true
        }
    )
    console.log(team);
    return res.json({ success: true, team });
})