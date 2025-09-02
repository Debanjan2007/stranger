import mongoose from "mongoose";
import { v4 as uuidV4 } from 'uuid'

const teamSchema = new mongoose.Schema({
    UID: {
        type: String,
        unique: true,
        default: uuidV4
    },
    teamName: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    session: {
        type: String,
    }
})

export const Team = mongoose.model('Team' , teamSchema)
