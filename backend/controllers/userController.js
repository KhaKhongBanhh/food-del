import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false, message: "User doesn't exist"});
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success:false, message: "Invalid credentials"});
        }

        // create token
        const token = createToken(user._id);
        res.json({success:true, token});

    }catch(error) {
        console.log(error);
        return res.json({success:false, message: "Error"});
    }
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try{
        // check if email is valid
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message: "User already exists"});
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message: "Please enter a valid email"});
        }

        if(password.length < 8){
            return res.json({success:false, message: "Password enter a strong password"});
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = new userModel({
            name:name,
            email:email,
            password: hashedPassword
        })

        const user = await newUser.save();
        // create token
        const token = createToken(user._id);
        res.json({success:true, token});

    }catch(error) {
        console.log(error);
        res.json({success:false, message: "Error"});
    }
}

export {loginUser, registerUser};