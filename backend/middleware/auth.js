//middleware to protect routes

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protectRoute = async (req, res, next) => {
try{const token = req.headers.token;
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.userId).select('-password');
if(!user){
    return res.json({success:false, message: 'Not authorized, user not found' });   }
//this will add user to req object so that we can access it in constroller function
    req.user = user;
next();
}
catch(err){
    return res.json({success:false, message:err.message });
}   
}