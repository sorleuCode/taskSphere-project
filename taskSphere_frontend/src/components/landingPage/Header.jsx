import React from 'react'
import { Link } from 'react-scroll';
import Loginbtn from './Loginbtn';

const Header = () => {
    return (
        <header className="bg-blue-700 sticky top-0 py-4 z-10 px-8 flex justify-between items-center">
            <div className="text-white text-[25px] font-bold">TaskSphere</div>
            <nav className="space-x-4">
                <Link to="about" smooth duration={500}><span className=" cursor-pointer text-white transition transform duration-300 hover:text-yellow-400 hover:underline hover:scale-110 text-xl">About</span></Link>
                <Link to="contact" smooth duration={500}><span className=" cursor-pointer text-white transition transform duration-300 hover:text-yellow-400 hover:underline hover:scale-110 text-xl">Contact</span></Link>
                <Link to="faq" smooth duration={500}><span className=" cursor-pointer text-white transition transform duration-300 hover:text-yellow-400 hover:underline hover:scale-110 text-xl">FAQ</span></Link>
                <Loginbtn/>
            </nav>
        </header>
    );
}

export default Header
