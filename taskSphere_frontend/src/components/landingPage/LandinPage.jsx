import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AOS from "aos";
import { FaEye, FaEyeSlash, FaProjectDiagram, FaStream, FaFlag, FaComments, FaGoogle} from "react-icons/fa";
import FAQ from "./FAQ";
import { Link } from "react-router-dom";
import Contact from "./Contact";




const ProgressBar = ({ label, percentage }) => {
    const [width, setWidth] = useState(0);
    const progressBarRef = useRef(null);

    useEffect(() => {

        AOS.init();

    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setWidth(0); // Reset width to 0
                        setTimeout(() => setWidth(percentage), 300);
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        if (progressBarRef.current) {
            observer.observe(progressBarRef.current);
        }

        return () => {
            if (progressBarRef.current) {
                observer.unobserve(progressBarRef.current);
            }
        };
    }, [percentage]);

    return (
        <div ref={progressBarRef} className="mb-4">
            <div className="flex justify-between mb-1">
                <span>{label}</span>
                <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-blue-700 h-2.5 rounded-full progress-bar"
                    style={{ "--progress-width": `${width}%` }}
                ></div>
            </div>
        </div>
    );
};

const LandinPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")



    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const notMatch = (password !== confirmPassword && confirmPassword !== "" ? true : false);


    const progressData = [
        { label: "Dynamic project management tools", percentage: 90 },
        { label: "Seamless communication", percentage: 80 },
        { label: "Integrated workflow management", percentage: 85 },
        { label: "Customizable workflows", percentage: 75 },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-blue-700 text-white p-8 pt-20 ">
                <div className="flex items-center justify-between">
                    <div className="">
                        <h1
                            data-aos="slide-right" data-aos-duration="2500"
                            className="text-4xl font-bold mb-4 w-3/4"
                        >
                            Join millions of TaskSphere users who manage and schedule their
                            tasks easily.
                        </h1>
                        <p className=" text-base mb-8 w-3/4 fade-in-text">
                            Enjoy the goodness of in-app real-time communication through
                            chatting and video conferencing with your team members Tasksphere
                            is a dynamic project management platform to provide an integrated
                            web app for all your project management needs.
                        </p>
                    </div>
                    <img
                        className="w-[90%] h-[400px] rounded-[10px] zoom-in"
                        src="/team.webp"
                        alt=""
                    />
                </div>

                <div name="about" className="px-4 py-8 flex flex-col items-center justify-center min-h-3/4 bg-gray-200 text-white rounded-[10px] mt-16">
                    <div className="m-auto text-black flex items-center justify-between w-[100%] ">
                        <div className="w-[50%]">
                            <h1 className="text-3xl font-medium mb-8">
                                Empowering Teams to Achieve More
                            </h1>
                            <div className="mt-4">
                                {progressData.map((item, index) => (
                                    <ProgressBar
                                        key={index}
                                        label={item.label}
                                        percentage={item.percentage}
                                    />
                                ))}
                            </div>


                            <section className="text-black">
                                <h2 className="text-3xl font-medium text-center mb-8">Our mission</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                                    <div className="flex flex-col items-center text-center">
                                        <FaProjectDiagram className="text-3xl mb-4 text-blue-700" />
                                        <h3 className=" text-sm font-normal">Reinventing project management</h3>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <FaStream className="text-3xl mb-4  text-blue-700"/>
                                        <h3 className="text-sm font-normal">Streamlining the workflow</h3>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <FaFlag className="text-3xl mb-4  text-blue-700"/>
                                        <h3 className="text-sm font-normal">Maximizing team productivity</h3>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <FaComments className="text-3xl mb-4  text-blue-700"/>
                                        <h3 className="text-sm font-normal">Enhancing team communication</h3>
                                    </div>
                                </div>
                            </section>

                        </div>

                        <div className="bg-white max-h-[100%] text-black rounded-lg p-6 shadow-lg w-full max-w-md">
                            <button className="bg-blue-700 text-white py-2 px-4 rounded mb-4 w-full flex items-center justify-start gap-28">
                                <FaGoogle />
                                <span>Sign up with Google</span>
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
                                <div className="mb-4">
                                    <label
                                        htmlFor="fullname"
                                        className="block text-sm font-medium"
                                    >
                                        Fullname
                                    </label>
                                    <input
                                        type="text"
                                        id="fullname"
                                        name="fullname"
                                        className="mt-1 p-2 w-full border rounded outline-none"
                                        placeholder="Enter your fullname"
                                        onChange={(e) => setFullname(e.target.value)}
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
                                        className="mt-1 p-2 w-full border rounded outline-none pr-10"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        className="absolute right-3 top-[2.8rem] transform -translate-y-1/2 cursor-pointer"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>

                                <p className="mb-3 w-full text-center text-sm text-red-500">{(notMatch) && "Password does not match!"}</p>

                                <button
                                    type="submit"
                                    className="bg-blue-700 text-white py-2 px-4 rounded w-full"
                                >
                                    Get Started for Free
                                </button>
                                <p className="mt-4">
                                    By signing up, you agree to TaskSphere&apos;s terms of service
                                    and privacy policy.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <FAQ />
                </div>

                <div className="mt-20">
                    <Contact/>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default LandinPage;