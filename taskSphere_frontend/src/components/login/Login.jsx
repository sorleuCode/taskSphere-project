import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="bg-white max-h-[100%] text-black rounded-lg p-6 shadow-lg w-full max-w-md">
        <button className="bg-red-500 text-white py-2 px-4 rounded mb-4 w-full flex items-center justify-start gap-28">
          <FaGoogle />
          <span>Sign In with Google</span>
        </button>
        <div className="text-center mb-4">OR</div>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Work Email (required)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded outline-none"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="mt-1 p-2 w-full border rounded outline-none pr-10"
              placeholder="Input your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-[2.8rem] transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            className="bg-blue-700 text-white py-2 px-4 rounded w-full"
          >
            Log In
          </button>
          <p className="mt-4">
            Do not have an account?{" "}
            <Link className=" text-medium text-blue-700" to="/">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
