import React from 'react'
import { Link } from 'react-scroll';
import Loginbtn from './Loginbtn';

const Header = () => {
    return (
        <header className="bg-blue-700 shadow-xlg shadow-blue-600 sticky top-0 py-4 z-10 px-8 flex justify-between items-center">
            <div className="text-white text-[25px] font-bold">TaskSphere</div>
            <nav className="space-x-4">
                <p className=" cursor-pointer text-white transition transform duration-300 inline-block hover:text-gray-300   hover:scale-110 text-xl"><Link to="about" smooth duration={500}>About</Link></p>
                <p className=" cursor-pointer text-white transition transform duration-300 inline-block hover:text-gray-300 hover:scale-110 text-xl"><Link to="contact" smooth duration={500}>Contact</Link></p>
                <p className=" cursor-pointer text-white transition transform duration-300 inline-block hover:text-gray-300 hover:scale-110 text-xl"><Link to="faq" smooth duration={500}>FAQs</Link></p>
                <Loginbtn/>
            </nav>
        </header>
    );
}

export default Header
