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
            { user ? (<div className="flex-1 p-6 overflow-y-auto bg-white text-black">
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
                    className="bg-gray-200 text-gray-700 hover:scale-110 transition duration-500 py-2 sm px-4 rounded-lg mb-6 flex items-center"
                >
                    <FaPlus className="mr-2" />
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
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <h3 className=" text-sm md:text-base font-semibold">My Boards</h3>
                            <div className="flex gap-3 items-center">
                                <div className="gap-2">
                                    <label className="ml-4 mr-2">Filter by:</label>
                                    <select
                                        className="border text-sm md:text-base outline-none border-gray-300 rounded py-2"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option className='text-sm md:text-base' value="">All Types</option>
                                        <option className='text-sm md:text-base' value="private">Private</option>
                                        <option className='text-sm md:text-base' value="public">Public</option>
                                    </select>
                                </div>
                                <div className="items-center bg-white border outline-none py-1">
                                    <input
                                        type="text"
                                        className="outline-none w-auto"
                                        placeholder="Search by title"
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
