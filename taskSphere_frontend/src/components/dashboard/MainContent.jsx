import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import BoardForm from '../../pages/Boards/BoardForm';
import BoardCards from './BoardCards';
import { useDispatch, useSelector } from 'react-redux';
import { Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchBoards } from '../../redux/reducers/boardSlice';
import { getUserDetail } from '../../redux/reducers/userSlice';

const MainContent = () => { 
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();
    const {user, status } = useSelector((state) => state.user)
    const { allBoards, loading, error } = useSelector((state) => state.board);

    useEffect(() => {

            dispatch(getUserDetail())
    
    },[dispatch])

    const handleCreateBoardClick = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };



    useEffect(() => {
        if (!allBoards.length) {
          dispatch(fetchBoards());
        }
      }, [dispatch, allBoards]);

    
    
      const nameSplit = () => {
        if (user && user?.fullname) {
            const username = user?.fullname;
            return `${username.split(" ")[0]}`;
        }
        return '';
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto bg-white text-black">
        <h1 className='pt-3 pb-4'> { user?.fullname &&<span> Welcome! <em className='text-blue-500 text-'>{ ` ${nameSplit()}`}</em></span>}</h1>
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
                            { allBoards.length > 0 ?

                                (allBoards.map((board) => (
                                    <Link key={board._id} to={`/boards/board/${board._id}`}>
                                        <BoardCards
                                            title={board.title}
                                            description={board.description}
                                            type={board.type}
                                        />
                                    </Link>
                                ))) :

                                <p>No boards to display</p>
                            }
                                
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainContent;
