import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewBoard } from '../../redux/reducers/boardSlice';
import { MdCancel } from "react-icons/md";
import { toast } from 'react-toastify';



const BoardForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const { status, error, allBoards, loading } = useSelector((state) => state.board);
    const [shouldSubmit, setShouldSubmit] = useState(false);


    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createNewBoard(formData));
        setShouldSubmit(true)

    };

    console.log(allBoards)

    useEffect(() => {
        if (!shouldSubmit) return; // Early return if not submitting

        if (status && !loading) {

            toast.success("board successfully created", { position: "top-right" })
            setFormData({ title: '', description: '', type: '' });
            setShouldSubmit(false)


        }
        if (!status && error) {
            toast.error("board not created", { position: "top-right" })
            setShouldSubmit(false)


            console.error(error);
        }



    }, [status, shouldSubmit, error]);

    return (
        <div className=" flex justify-center items-center min-h-screen bg-gray-400 bg-opacity-20">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg relative bg-white  shadow-lg rounded-lg p-8 space-y-6"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-8 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <MdCancel className=' text-blue-700 hover:scale-80' size={24} />
                </button>
                <div>

                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter board title"
                        required
                    />
                </div>

                <div>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter board description"
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div>

                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="">Select board type</option>
                        <option value="private">Private</option>
                        <option value="public">Public</option>

                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {loading ? 'Creating...' : 'Create Board'}
                </button>
            </form>
        </div>
    );
};

export default BoardForm;
