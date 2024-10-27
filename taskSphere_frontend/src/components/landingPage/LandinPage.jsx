import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import {
  FaEye,
  FaEyeSlash,
  FaProjectDiagram,
  FaStream,
  FaFlag,
  FaComments,
  FaGoogle,
} from "react-icons/fa";
import FAQ from "./FAQ";
import { Link, useNavigate, } from "react-router-dom";
import Contact from "./Contact";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "./ProgressBar";
import { toast } from "react-toastify";
import { registerUser } from "../../redux/reducers/userSlice";

const LandinPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, status, user } = useSelector((state) => state.user);

  const queryParams = new URLSearchParams(window.location.search);
  const invitationId = queryParams.get('invitationId');

  const notMatch =
    formData.password !== confirmPassword && confirmPassword !== "";

  const progressData = [
    { label: "Dynamic project management tools", percentage: 90 },
    { label: "Seamless communication", percentage: 80 },
    { label: "Integrated workflow management", percentage: 85 },
    { label: "Customizable workflows", percentage: 75 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "confirm-password") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignUpwithGoogle = () => {
    window.location.href = `https://tasksphereapi.vercel.app/users/auth/google`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lowercaseEmail = formData.email.toLowerCase()
    const newFormData = { ...formData, email: lowercaseEmail }
    dispatch(registerUser({ ...newFormData, invitationId: invitationId ? invitationId : null }));
    setShouldSubmit(true)


  };

  useEffect(() => {
    if (!shouldSubmit) return; // Early return if not submitting

    if (status) {
      toast.success("Confirm your Email", { position: "top-right" });
      navigate("/user/verifyEmail");
      setShouldSubmit(false);
    } else if (!status && error) {
      toast.error(error);
      setShouldSubmit(false);
    }
  }, [shouldSubmit, status, error, navigate]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-blue-600 text-white py-4 pt-8 px-4 lg:px-5 md:py-8  md:pt-18 lg:pt-20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2">
            <h1
              data-aos="slide-right"
              data-aos-duration="2500"
              className="text-lg sm:text-2xl md:text-4xl font-bold mb-4 lg:w-[80%]"
            >
              Join millions of TaskSphere users who manage and schedule their tasks easily.
            </h1>
            <p className="text-[14px] w-full  sm:text-base md:text-lg mb-8 lg:w-[90%] fade-in-text">
              Enjoy the goodness of in-app real-time communication through chatting and video conferencing with your team members. TaskSphere is a dynamic project management platform that provides an integrated web app for all your project needs.
            </p>
          </div>
          <img
            className="w-full lg:w-[50%] h-[200px] sm:h-[300px] lg:h-[400px] rounded-[10px] zoom-in"
            src="/team.webp"
            alt="Team collaboration"
          />
        </div>



        <div className="about px-4 py-8 flex flex-col items-center justify-center min-h-3/4 bg-gray-200 text-white rounded-[10px] mt-16">
          <div className="m-auto text-black  flex flex-col md:flex-row items-center md:gap-16 lg:justify-between w-full">
            <div className=" w-[100%] md:w-[50%]">
              <h1 className=" text-md md:text-lg lg:text-3xl font-medium mb-8">
                Empowering Teams to Achieve More
              </h1>
              <div className="mt-4 ">
                {progressData.map((item, index) => (
                  <ProgressBar
                    key={index}
                    label={item.label}
                    percentage={item.percentage}
                  />
                ))}
              </div>

              <section className="text-black">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center mb-8">
                  Our mission
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                  <div className="flex flex-col items-center text-center">
                    <FaProjectDiagram className="text-3xl mb-4 text-blue-600" />
                    <h3 className="text-sm font-normal">
                      Reinventing project management
                    </h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <FaStream className="text-3xl mb-4 text-blue-600" />
                    <h3 className="text-sm font-normal">
                      Streamlining the workflow
                    </h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <FaFlag className="text-3xl mb-4 text-blue-600" />
                    <h3 className="text-sm font-normal">
                      Maximizing team productivity
                    </h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <FaComments className="text-3xl mb-4 text-blue-600" />
                    <h3 className="text-sm font-normal">
                      Enhancing team communication
                    </h3>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-white  max-h-[100%] text-black mt-6 md:mt-0 p-4 rounded-lg md:p-6 shadow-lg md:w-[50%] w-full max-w-md">
              <div
                className="bg-blue-600 cursor-pointer text-white py-2 px-4 rounded mb-4 w-full flex items-center justify-center gap-3 sm:gap-6 md:gap-16 lg:gap-28"
                onClick={handleSignUpwithGoogle}
              >
                <FaGoogle />
                <span className="text-[14px] sm:text-base">Sign up with Google</span>
              </div>
              <div className="text-center mb-4">OR</div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4 ">
                  <label htmlFor="email" className="block text-[14px] sm:text-sm font-medium">
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
                <div className="mb-4">
                  <label
                    htmlFor="fullname"
                    className="block text-[14px] sm:text-sm font-medium"
                  >
                    Fullname
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="mt-1 p-2 w-full border rounded outline-none"
                    placeholder="Enter your fullname"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4 relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
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
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="mb-4 relative">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    id="confirm-password"
                    placeholder="Confirm your password"
                    name="confirm-password"
                    className="mt-1 p-2 w-full border rounded outline-none pr-10"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute right-3 top-[2.8rem] transform -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {notMatch && (
                  <p className="mb-3 w-full text-center text-sm text-red-500">
                    Password does not match!
                  </p>
                )}

                <button
                  type="submit"
                  className="bg-blue-600 text-white text-[14px] sm:text-base text-center py-2 px-4 rounded w-full submit-button"
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    "Register for free"
                  )}
                </button>
                <p className="mt-4 w-full sm:text-base text-sm">
                  By signing up, you agree to TaskSphere's terms of service and
                  privacy policy.
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <FAQ />
        </div>

        <div className="mt-20">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandinPage;
