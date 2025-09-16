//function to generate token 
import jwt from 'jsonwebtoken';

// to generate JWT token we need user id and secret key
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    return token;
}