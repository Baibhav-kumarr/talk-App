import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js'

// 🔹 Signup
export const signup = async (req, res) => {
   const { email, fullName, password  , bio} = req.body;
    try {
   if(!email || !fullName || !password || !bio){
    return res.json({success: false , message:"missing detail"})
   }
    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {return res.json({success: false , message:"account already exists"})}

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
        bio
      
    });
//caling util function to generate token
    const token = generateToken(newUser._id);
    // return user and token
    res.json({success : true ,userData: newUser , token, message: 'User registered successfully' });
  } catch (err) {
    console.log(err.message);
    res.json({success:false, message: err.message });
  }
};



// 🔹 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const userData = await User.findOne({ email });
    // check password
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) return res.json({  success:false, message: 'Invalid credentials' });

    //if password correct  generate JWT
    const token = generateToken(userData._id);

    res.json({success:true ,userData , token , message: 'Login successful'});
  } catch (err) {
    console.log(err.message);
    res.json({success:false  ,message: err.message });
  }
};


// 🔹 Middleware for authentication
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};

// 🔹 Update Bio
export const updateProfile = async (req, res) => {
  try {
    const { profilePic  , bio  , fullName} = req.body;
    const userId = req.user._id;
    let updatedUser;
    if(!profilePic){
        updatedUser = await User.findByIdAndUpdate(userId, { bio  , fullName}, { new: true });
    }
    else{
        const upload = await cloudinary.uploader.upload(profilePic);
        updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url , bio  , fullName}, { new: true });
    }
    res.json({success:true , user:updatedUser ,  message: 'Bio updated' });
  } catch (err) {
    console.log(err.message);
    res.json({success:false ,  message: err.message });
  }
};
