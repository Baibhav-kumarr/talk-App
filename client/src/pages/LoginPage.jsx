import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext.jsx';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const { login } = useContext(AuthContext);

  {/** jab signup form submit to isSubmittedData ko true kar deta hai initially it is false */}
  const onSubmitHandler = (event) => {
    event.preventDefault();
    {/*event ek object hoga jisme form ke bare me details hongi (kisne trigger kiya, kaunsi key press hui, etc).
      *🔹 2. event.preventDefault() kya karta hai?

By default, agar form submit hota hai to browser page reload kar deta hai.
(kyunki HTML forms ka default behavior hai: server ko request bhejna aur page reload karna).

👉 React apps me hume page reload nahi chahiye, kyunki hum data ko frontend (state) me handle karte hain.
Isliye hum likhte hain */}
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Sign up" ? "signup" : "login", { fullName, email, password, bio });
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/**Left side me logo dikh raha hai.
Right side me form hai (white transparent box, Tailwind styles ke sath). */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw , 250px)]' />

      <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
          {/**Agar Sign up mode hai aur pehla step complete hai (isDataSubmitted=true) → ek back arrow show hota hai jo dobara pehle step pe le jata hai. */}
        </h2>

        {/**👉 Matlab: Agar
currState === "Sign up" aur
isDataSubmitted === false
tab hi Full Name ka input field dikhega.
💡 Login mode me ya jab data already submit ho gaya hai, tab ye input nahi dikhega. */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {/** email and password for both email and password it takes input */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {/** page sign up pe ahi and submitted pe ho to set bio */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio..."
            required
          />
        )}

        {/**agar currState signup hai to create account nahi to login */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/** term and condition for term and condition */}
        <div className='flex items-center gap-2 text-sm text-grey-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        {/** toggle between login and signup */}
        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className='font-medium text-violet-500 cursor-pointer'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account{" "}
              <span
                onClick={() => setCurrState("Sign up")}
                className='font-medium text-violet-500 cursor-pointer'
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>

      {/**Haan ✅ bilkul sahi samjhe 👇

🔹 Submit ka role dono me

Agar Sign up mode hai →

Pehle submit karne par isDataSubmitted = true set hota hai → Bio field dikhta hai.

Dusre submit par poora form (fullName, email, password, bio) submit karna hota hai.

Agar Login mode hai →

Ek hi submit hota hai, jo email + password ke saath login karta hai. */}
    </div>
  );
};

export default LoginPage;