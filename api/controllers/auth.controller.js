import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from './../utils/error.js';
import  jwt  from "jsonwebtoken";

export const signup = async (req,res,next)=>{

    // console.log("req.body = ",req.body)
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    
    try{
        await newUser.save();
        res.status(201).json({"message":"User created successfully!"});
    }catch(error){
        // res.status(500).json({"error":error});
        // next(errorHandler(550,'Error from signup route!'));
        next(error);
    }
    
}

export const signin = async (req,res,next)=>{
    const {email,password} = req.body;
    try{

        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'User not found'));

        const validPassword = bcrypt.compareSync(password,validUser.password)
        if(!validPassword) return next(errorHandler(401,"Invalid credentials"));

        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);


        //separate password from users data
        const {password:pass, ...rest} = validUser._doc;

        res.cookie( 'access_token',token,{httpOnly:true}).status(200).json(rest);


    }catch(error){
        next(error);
    }
}

export const googleSignin = async (req,res,next)=>{

    try {

        const user = await User.findOne({email:req.body.email})
        if(user){
                //register the user
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            const {password:pass,...rest} = user._doc
            res
            .cookie('access_token',token,{httpOnly:true})
            .status(200)
            .json(rest);


        }else{
                //create the user

            const generateRandomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // 8+8 = 16 dijit random password
            const hashedPassword = bcrypt.hashSync(generateRandomPassword,10);
            const generateUniqueName = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = new User({username:generateUniqueName,email:req.body.email,password:hashedPassword,avatar:req.body.avatar});
            await newUser.save()
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:pass,...rest} = newUser._doc
            res
            .cookie('access_token',token,{httpOnly:true})
            .status(200)
            .json(rest);
        }
        
    } catch (error) {
        next(error);
    }


}


export const signOutUser = (req,res,next)=>{

    try {
        res.clearCookie("access_token");
        res.status(200).json("User has been logged out!");
    } catch (error) {
        next(error)
    }
}