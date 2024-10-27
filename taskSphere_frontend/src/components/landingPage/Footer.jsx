import React from 'react'
import { FaWhatsapp, FaTwitter } from "react-icons/fa6";
import { CiFacebook, CiMail} from "react-icons/ci";


const date = new Date();

const Footer = () => {
    return (
        <footer className=" bg-gray-800 flex justify-between w-full  text-white px-4  py-2 lg:px-8 h-25">
            <span className=' flex text-sm sm:text-base flex-col min-w-[15%] justify-end min-h-[100%] '>TaskSpere&copy; 2024</span>
            <div className=" mx-auto flex flex-col justify-center items-center">
                <p className=' mb-[8px] sm:mb-2 lg:mb-4 text-base sm:text-lg font-medium'>Our Socials</p>
                <nav className=" flex flex-row  w-full justify-center items-center space-x-5 md:space-x-6 lg:space-x-8">
                   <div className=' cursor-pointer rounded-md flex text-sm sm:text-base md:lg  lg:text-2xl justify-center h-[22px] w-[22px] sm:w-[30px] sm:h-[30px] items-center lg:h-[40px] lg:w-[40px] hover:bg-blue-700 bg-slate-500'><a href="#"><FaWhatsapp/></a></div>
                   <div className=' cursor-pointer rounded-md flex text-sm sm:text-base md:lg lg:text-2xl justify-center h-[22px] w-[22px] sm:w-[30px] sm:h-[30px]  items-center lg:h-[40px] lg:w-[40px] hover:bg-blue-700 bg-slate-500'><a href="#"><FaTwitter/></a></div>
                   <div className=' cursor-pointer rounded-md flex text-sm sm:text-base md:lg lg:text-2xl justify-center h-[22px] w-[22px] sm:w-[30px] sm:h-[30px]  items-center lg:h-[40px] lg:w-[40px] hover:bg-blue-700 bg-slate-500'><a href="#"><CiFacebook/></a></div>
                   <div className=' cursor-pointer rounded-md flex text-sm sm:text-base md:lg lg:text-2xl justify-center h-[22px] w-[22px] sm:w-[30px] sm:h-[30px]  items-center lg:h-[40px] lg:w-[40px] hover:bg-blue-700 bg-slate-500'><a href="href=mailto:soliumuhammed953@gmail.com"><CiMail/></a></div>
                </nav>
            </div>
        </footer>

    )
}

export default Footer
