import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6 // you can adjust as per need
    },
    profilePic: {
      type: String, // usually store URL or file path
      default:"" 
    },
    bio: {
      type: String,
      default:""
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

const User = mongoose.model('User', userSchema);

export default User;
