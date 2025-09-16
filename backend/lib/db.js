// db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    //Event Listener ka matlab
    //Wo continuously sun raha hota hai ki koi particular event (jaise "connected") hua ya nahi.
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/chatApp`)
  } catch (err) {
    console.error(err.message);
  }
};

