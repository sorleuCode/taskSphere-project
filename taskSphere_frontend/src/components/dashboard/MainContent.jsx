import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import BoardForm from '../../pages/Boards/BoardForm';
import BoardCards from './BoardCards';
import { useDispatch, useSelector } from 'react-redux';
import { Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchBoards } from '../../redux/reducers/boardSlice';

const MainContent = () => { 
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();

    const { allBoards, status, loading, error } = useSelector((state) => state.board);

    const handleCreateBoardClick = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    useEffect(() => {
        dispatch(fetchBoards());
    }, [dispatch]);

    useEffect(() => {
        if(status && allBoards.length === 0) {
            toast.error("No boards to display", {position: "top-right"})
        }
    }, [allBoards, status])

    return (
        <div className="flex-1 p-6 overflow-y-auto bg-white text-black">
            {!showForm ? (
                <button
                    onClick={handleCreateBoardClick}
                    className="bg-gray-200 text-gray-700 hover:scale-110  transition duration-500 py-2 px-4 rounded-lg mb-6 flex items-center"
                >
                    <FaPlus className="mr-2" />
                    Create new board
                </button>
            ) : (
                <div className="w-full">
                    <BoardForm onClose={handleCloseForm} />
                </div>
            )}

            {showForm ? null : (
                <div>
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">My Boards</h3>
                            <div className="flex gap-3 items-center">
                                <div className="gap-2">
                                    <label className="ml-4 mr-2">Filter by:</label>
                                    <select className="border outline-none border-gray-300 rounded p-2">
                                        <option>Choose a collection</option>
                                    </select>
                                </div>
                                <div className="relative flex items-center bg-white border outline-none border-gray-300 rounded p-2">
                                    <input
                                        type="text"
                                        className="outline-none"
                                        placeholder="Search"
                                    />
                                    <FaSearch className="ml-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex h-[100%] items-center justify-center'>
                        {loading && !error ? (
                            <p className=' text-blue-500'>Fetching boards...</p>
                        ) : error ? toast.error("Error fetching boards", { position: "top-right" }):(
                            <div className="flex flex-wrap gap-6">
                                {allBoards.map((board) => (
                                    <Link key={board._id} to={`/boards/board/${board._id}`}>
                                        <BoardCards
                                            title={board.title}
                                            description={board.description}
                                            type={board.type}
                                        />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainContent;
