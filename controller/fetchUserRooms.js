import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../model/user.model.js";
import { Team } from "../model/teams.model.js";
import fs from 'fs'
import mongoose from "mongoose";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dirName = path.join(__dirname , "Teams")


export const fetchuser = asyncHandler(async (req , res) => {
    try {
        console.log(__dirname);
        
        const userPayload = req.user
        const user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(`${userPayload.id}`)
                }
            },
            {
                $project: {
                    "teams" : 1,
                    "userName": 1
                }
            }
        ])
        if(!user){
            console.error("error:", error);
            return res.redirect('/?error="internal"')
        }
        console.log(user[0].teams);
        const teamDetails = [] ;
        for(let elm of user[0].teams){
            const team = await Team.aggregate([
                {
                    $match: {
                        UID: elm.UID
                    }
                },
                {
                    $project: {
                        "teamName": 1,
                        "members" : 1,
                        "admins": 1
                    }
                }
            ])
        console.log(team);
        teamDetails.push(team)
        }
        console.log(teamDetails);
        
    } catch (error) {
        console.error("error:", error);
        return res.json({ success: false, message: "Registration failed" , redirect: "/register" }); 
    }
})