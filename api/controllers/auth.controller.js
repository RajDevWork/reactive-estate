import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res,next)=>{

    // console.log("req.body = ",req.body)
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword})
    try{
        await newUser.save();
        res.status(201).json({"message":"User created successfully!"});
    }catch(error){
        // res.status(500).json({"error":error});
        // next(errorHandler(550,'Error from signup route!'));
        next(error);
    }
    
}