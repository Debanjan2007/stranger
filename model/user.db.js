import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    userName : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
} , { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.genAccessToken = async () => {
    jwt.sign(
        {
            id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )
}
userSchema.methods.genRefreshToken = async () => {
    jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_SECRET,
        
        {
            algorithm: process.env.JWT_ALGO,
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )
}

export default mongoose.model("User", userSchema)