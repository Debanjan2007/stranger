import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.genAccessToken = async function (){
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.JWT_REFRESH_SECRET,
        {
            algorithm: "HS256",
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )
}
userSchema.methods.genRefreshToken = async function(_id) {
    return jwt.sign(
        {
            id: _id,
        },
        process.env.JWT_REFRESH_SECRET,

        {
            algorithm: "HS256",
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        }
    )
}

export const User = mongoose.model("User", userSchema)
