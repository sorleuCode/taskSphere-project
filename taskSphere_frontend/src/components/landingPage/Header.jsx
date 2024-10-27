import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import Loginbtn from './Loginbtn';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-blue-700 shadow-xlg shadow-blue-600 sticky top-0 py-2 sm:py-4 z-10 px-3 sm:px-8 flex justify-between items-center">
      <div className="text-white text-[18px] sm:text-[22px] md:text-[25px] font-bold">TaskSphere</div>

      {/* Mobile Menu Icon */}
      <div className="sm:hidden text-white text-xl cursor-pointer" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes/> : <FaBars />}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex space-x-4">
        <p className="cursor-pointer text-white transition transform duration-300 inline-block hover:text-gray-300 hover:scale-110 text-xl">
          <Link to="about" smooth duration={500}>About</Link>
        </p>
        <p className="cursor-pointer text-white transition transform duration-300 inline-block hover:text-gray-300 hover:scale-110 text-xl">
          <Link to="contact" smooth duration={500}>Contact</Link>
        </p>
        <p className="cursor-pointer text-white transition transform duration-300 inline-block hover:text-gray-300 hover:scale-110 text-xl">
          <Link to="faq" smooth duration={500}>FAQs</Link>
        </p>
        <Loginbtn />
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden absolute top-[2.7rem] left-0 right-0 bg-blue-700 text-white shadow-lg rounded-b-lg p-4 flex flex-col space-y-4 z-20">
          <p className="cursor-pointer transition transform duration-300 hover:text-gray-300 text-md">
            <Link to="about" smooth duration={500} onClick={toggleMobileMenu}>About</Link>
          </p>
          <p className="cursor-pointer transition transform duration-300 hover:text-gray-300 text-md">
            <Link to="contact" smooth duration={500} onClick={toggleMobileMenu}>Contact</Link>
          </p>
          <p className="cursor-pointer transition transform duration-300 hover:text-gray-300 text-md">
            <Link to="faq" smooth duration={500} onClick={toggleMobileMenu}>FAQs</Link>
          </p>
          <Loginbtn />
        </nav>
      )}
    </header>
  );
};

export default Header;
