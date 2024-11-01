import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import BoardForm from '../../pages/Boards/BoardForm';
import BoardCards from './BoardCards';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchBoards } from '../../redux/reducers/boardSlice';
import { getUserDetail } from '../../redux/reducers/userSlice';
import Loader from '../loader/Loader';

const MainContent = () => {
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState(''); // For filtering by board type
    const [searchTerm, setSearchTerm] = useState(''); // For searching boards by title
    const dispatch = useDispatch();
    const { user, status } = useSelector((state) => state.user);
    const { allBoards, loading, error } = useSelector((state) => state.board);

    // Fetch user details once when the component mounts
    useEffect(() => {
        if (!user || Object.keys(user).length === 0) {
            dispatch(getUserDetail());
        }
    }, [dispatch, user]);

    // Fetch boards once after the user details have been fetched
    useEffect(() => {
        if (user && allBoards.length === 0 && !loading && !error) {
            dispatch(fetchBoards());
        }
    }, [dispatch, allBoards.length, loading, error]);


    const handleCreateBoardClick = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const nameSplit = () => {
        if (user && user?.fullname) {
            const username = user?.fullname;
            return `${username.split(" ")[0]}`;
        }
        return '';
    };

    // Filtered boards based on type and search term
    const filteredBoards = allBoards.filter((board) => {
        return (filter ? board.type === filter : true) && 
               (searchTerm ? board.title.toLowerCase().includes(searchTerm.toLowerCase()) : true);
    });

    return (
        <>
            { user ? (<div className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-white text-black">
            <h1 className='pt-3 pb-4'>
                {status === "loading" ? (
                    <p>Loading user...</p>
                ) : (
                    user?.fullname && <span> Welcome! <em className='text-blue-500'>{nameSplit()}</em></span>
                )}
            </h1>
            {!showForm && (
                <button
                    onClick={handleCreateBoardClick}
                    className="bg-gray-200 text-[16px] sm:text-base  text-gray-700 hover:scale-110 transition duration-500 py-2 sm px-2 rounded-lg mb-6 flex items-center"
                >
                    <FaPlus className="mr-2 text-sm sm:text-base" />
                    Create new board
                </button>
            )}

            {/* Modal for BoardForm */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <BoardForm onClose={handleCloseForm} />
                </div>
            )}

            {!showForm && (
                <div>
                    <div className="mb-6 ">
                        <div className="flex justify-between items-center">
                            <h3 className=" text-sm md:text-base font-semibold hidden md:block">My Boards</h3>
                            <div className="flex gap-3 items-center">
                                <div className='flex flex-col justify-center items-start gap-[2px] flex-nowrap'>
                                    <label className="text-sm md:text-base">Filter by:</label>
                                    <select
                                        className="border text-sm md:text-base outline-none border-gray-300 rounded p-[1px] py-[5px]"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option className='text-sm md:text-base' value="">All Types</option>
                                        <option className='text-sm md:text-base' value="private">Private</option>
                                        <option className='text-sm md:text-base' value="public">Public</option>
                                    </select>
                                </div>
                                <div className="flex flex-col justify-center items-start gap-[2px] flex-nowrap">
                                    <label className='text-sm md:text-base' htmlFor="">Search:</label>
                                    <input
                                        type="text"
                                        className="border placeholder:px-2 placeholder:text-sm md:placeholder:text-base outline-none border-gray-300 rounded px-[2px] py-[2px] max-w-[60%] sm:w-[80%] md:w-[70%]"
                                        placeholder="Title"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex h-[100%] items-center justify-center'>
                        {loading ? (
                            <p className='text-blue-500'>Fetching boards...</p>
                        ) : filteredBoards.length ? (
                            <div className="flex flex-wrap gap-6">
                                {filteredBoards.map((board) => (
                                    <Link key={board._id} to={`/boards/board/${board._id}`}>
                                        <BoardCards
                                            title={board.title}
                                            description={board.description}
                                            type={board.type}
                                        />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p>No boards to display</p>
                        )}
                    </div>
                </div>
            )}
        </div>) : <div><Loader/></div>}
        </>
        
    );
};

export default MainContent;
