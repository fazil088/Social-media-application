import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

const sendOTP = async (email, OTP, name) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });

        let mailGenerator = new Mailgen({
            theme: "default",
            product:{
                name: "Mailgen",
                link: "https://mailgen.js/"
            }
        })

        let response = {
            body:{
               name: name,
               intro: `Your OTP is ${OTP}`
            }
        }

        let mail = mailGenerator.generate(response);

        const mailOpt = {
            from: process.env.EMAIL,
            to: email,
            subject: "OTP verification",
            html: mail
        }

        transporter.sendMail(mailOpt,(err,info)=>{
            if(err){
                console.log("OTP sending failed",err)
            }else{
                console.log('OTP sended successfully',info.response)
            }
        })
        
    }
    catch(err){
        console.log('OTP sending failed:', err)
    }
}

export const register = async (req,res)=>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picture,
            friends,
            location,
            occupation
        } = req.body

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({msg:"Email is already registered"})
        }
        
        // password bcrypt
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            picturePath:picture,
            location,
            occupation,
            friends,
            profileViews:Math.floor(Math.random()* 1000),
            impressions:Math.floor(Math.random()*1000)
        })


        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }catch(err){
        res.status(500).json({error:err.message})
        console.log('Error is:',err)
    }
}

export const login = async (req,res) => {
    try{
        const {email,password } = req.body;

        // Find user 
        const user = await User.findOne({email:email});
        if(!user) return res.status(500).json({msg:"User does not exist."})

        // Password matching
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(500).json({msg:"Invalid credentials"})

        // generate OTP and send to the email
        const otp = Math.floor(100000 + Math.random()*900000);
        const otpTime = new Date().getTime() + 5 * 60 * 1000;
        
        // send the OTP in email
        sendOTP(email,otp,user.firstName + user.lastName)

        user.verificationOTP = otp;
        user.expOfOTP = otpTime;

        // Token will be adding
        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);
        delete user.password;

        await user.save()
        res.status(201).json({token,user})
    }catch(err){
        res.status(500).json({msg:err.message})
        console.log("Error is :",err.message)
    }
}

export const verifyOTP = async (req, res) =>{
    try{
        const { otp, email} = req.body;

        const user = await User.findOne({email: email})
        if(!user) return res.status(404).json({msg:"User not found"})

        if(new Date().getTime() > user.expOfOTP){
            return res.status(400).json({msg:'OTP has expired, Please login again :('})
        }

        if(user.verificationOTP !== otp){
            return res.status(401).json({msg:'Invalid OTP :('})
        }

        res.status(200).json({msg:'Verification Successfull'})
    }catch(err){
        res.status(500).json(err.message)
    }
}