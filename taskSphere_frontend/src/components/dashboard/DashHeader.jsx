import React from "react";
import { FaPlus, FaSearch, FaStar, FaChevronDown } from 'react-icons/fa';
import AppBar from "../AppBar/AppBar";

const DashHeader = () => {
    return (

        <AppBar/>
        // <div className="flex justify-between items-center py-4 px-6 bg-white border-b border-gray-200">
        //     <div className="flex items-center">
        //         <h1 className="text-xl font-bold mr-4">TaskSphere</h1>
        //         <div className="relative">
        //             <button className="flex items-center bg-gray-200 text-gray-700 py-1 px-3 rounded">
        //                 Workspace <FaChevronDown className="ml-2" />
        //             </button>
        //             {/* Dropdown for workspaces */}
        //             <div className=" hidden absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-lg">
        //                 <div className="p-2">Afeez's Workspace</div>
        //                 {/* Add more workspaces here */}
        //             </div>
        //         </div>

        //         <div className="ml-4">
        //             <button className="flex items-center bg-gray-200 text-gray-700 py-1 px-3 rounded">
        //                 <FaStar className="mr-2" />
        //                 Starred
        //             </button>
        //         </div>
        //     </div>
        //     <div className="ml-4">
        //         <button className="bg-blue-700 text-white py-1 px-3 rounded flex items-center">
        //             <FaPlus className="mr-2" />
        //             Create
        //         </button>
        //     </div>
        // </div>
    )
}

export default DashHeader
