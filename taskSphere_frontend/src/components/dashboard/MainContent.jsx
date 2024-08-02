import React from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MainContent = () => {
    return (
        <div className="flex-1 p-6 bg-white text-black">
            <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg mb-6 flex items-center">
                <FaPlus className="mr-2" />
                Create new board
            </button>
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">My Boards</h3>
                    <div className="flex gap-3 items-center">
                        <div className='gap-2'>
                            <label className="ml-4 mr-2">Filter by:</label>
                            <select className="border outline-none border-gray-300  rounded p-2">
                                <option className=' shadow-none' sh>Choose a collection</option>
                            </select>
                        </div>
                        <div className='relative flex items-center bg-white border outline-none border-gray-300 rounded p-2'>
                            <input type="text" className=" outline-none" placeholder="Search" />
                            <FaSearch className="ml-2" />
                        </div>


                    </div>
                </div>
            </div>
            <div className="flex flex-wrap">
                <Link to="/board"><div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-lg shadow-md transform transition duration-500 hover:scale-105">
                    <h2   className="text-lg font-bold cursor-pointer">My Design</h2>
                </div>
                </Link> 
            </div>
        </div>
    );
};

export default MainContent;
