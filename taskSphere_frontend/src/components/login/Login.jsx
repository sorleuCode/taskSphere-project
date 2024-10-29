import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/reducers/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, user, error, loading } = useSelector((state) => state.user);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignInwithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/users/auth/google`;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const lowercaseEmail = formData.email.toLowerCase()
    const newFormData = {...formData, email: lowercaseEmail}
    dispatch(loginUser(newFormData));
    setIsSubmitting(true);
  

  };

  useEffect(() => {
    if (!isSubmitting) return; 
  
    if (status && user) {
      toast.success("Login successful!", {position: "top-right"});
      navigate(`/dashboard`);
      setIsSubmitting(false)
    } else if (!status && error) {
      toast.error(error, {position: "top-right"});
    }
  }, [ status, error, navigate]);

  return (
    <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-blue-600">
      <div className="bg-white max-h-[100%] text-black rounded-lg p-6 shadow-lg w-full max-w-md">
        <button
          onClick={handleSignInwithGoogle}
          className="bg-blue-600 text-white text-sm sm:text-base py-2 px-4 rounded mb-4 w-full flex items-center justify-center gap-3 sm:gap-6 md:gap-16 lg:gap-28"
        >
          <FaGoogle />
          <span>Sign In with Google</span>
        </button>
        <div className="text-center mb-4">OR</div>
        <form onSubmit={handleSubmit}>
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
              onChange={handleChange}
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
              onChange={handleChange}
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
            className="bg-blue-600 text-white py-2 text-sm sm:text-base  px-4 rounded w-full"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          <p className="mt-4">
            Do not have an account?{" "}
            <Link className="text-medium text-blue-600" to="/">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
