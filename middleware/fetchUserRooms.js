import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../model/user.model.js";
import { Team } from "../model/teams.model.js";
import fs from 'fs'
import mongoose from "mongoose";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dirName = path.join(__dirname, "../Teams")

export const fetchuser = asyncHandler(async (req , res , next) => {
    try {        
        const { userName } = req.user
        const filepath = path.join(dirName, `${userName}.json`)
        const user = await User.aggregate([
            {
                $match: {
                    userName: userName,
                }
            },
            {
                $project: {
                    "teams": 1,
                    "userName": 1
                }
            }
        ])
        const TeamArr = []
        for (let elm of user[0].teams) {
            const team = await Team.aggregate([
                {
                    $match: {
                        UID: elm.UID
                    }
                },
                {
                    $project: {
                        "teamName": 1,
                        "members": 1,
                        "admins": 1
                    }
                }
            ])
            if (team.length > 0) {
                TeamArr.push(team[0]);
            }
        }
        fs.writeFileSync(filepath , JSON.stringify(TeamArr, null, 2), 'utf-8', (error) => {
            if (error) return console.log(error);
        })
        next() 
    } catch (error) {
        console.error("error:", error);
        return ;
    }
})