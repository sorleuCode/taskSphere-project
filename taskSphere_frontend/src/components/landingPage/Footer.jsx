import React from 'react'
import { FaWhatsapp, FaTwitter } from "react-icons/fa6";
import { CiFacebook, CiMail} from "react-icons/ci";


const date = new Date();

const Footer = () => {
    return (
        <footer className=" bg-gray-800 flex  text-white  py-4 px-8 h-25">
            <span className=' flex flex-col min-w-[15%] justify-end min-h-[100%] '>TaskSpere&copy; 2024</span>
            <div className=" w-full mx-auto flex flex-col justify-center items-center">
                <p className='mb-4 text-lg font-medium'>Our Socials</p>
                <nav className=" flex flex-row w-full justify-center items-center space-x-8">
                   <div className=' cursor-pointer rounded-md flex text-2xl justify-center items-center h-[40px] w-[40px] hover:bg-blue-700 bg-slate-500'><a href="#"><FaWhatsapp/></a></div>
                   <div className=' cursor-pointer rounded-md flex text-2xl justify-center items-center h-[40px] w-[40px] hover:bg-blue-700 bg-slate-500'><a href="#"><FaTwitter/></a></div>
                   <div className=' cursor-pointer rounded-md flex text-2xl justify-center items-center h-[40px] w-[40px] hover:bg-blue-700 bg-slate-500'><a href="#"><CiFacebook/></a></div>
                   <div className=' cursor-pointer rounded-md flex text-2xl justify-center items-center h-[40px] w-[40px] hover:bg-blue-700 bg-slate-500'><a href="href=mailto:soliumuhammed953@gmail.com"><CiMail/></a></div>
                </nav>
            </div>
        </footer>

    )
}

export default Footer
