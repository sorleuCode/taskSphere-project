import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewBoard } from '../../redux/reducers/boardSlice';
import { MdCancel } from "react-icons/md";
import { toast } from 'react-toastify';

const BoardForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const { status, error, loading } = useSelector((state) => state.board);
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
        setShouldSubmit(true);
    };

    useEffect(() => {
        if (!shouldSubmit) return;

        if (status && !loading) {
            toast.success("Board successfully created", { position: "top-right" });
            setFormData({ title: '', description: '', type: '' });
            setShouldSubmit(false);
            onClose();  // Close the form after successful submission
        }
        if (!status && error) {
            toast.error("Board not created", { position: "top-right" });
            setShouldSubmit(false);
        }
    }, [status, shouldSubmit, error, onClose]);

    return (
        <div className="relative bg-white shadow-lg rounded-lg p-8 space-y-6">
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
                <MdCancel className=' text-blue-400 hover:scale-110' size={24} />
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
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400"
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
                onClick={handleSubmit}
                type="submit"
                className="w-full py-3 px-4 bg-blue-400 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
            >
                {loading ? 'Creating...' : 'Create Board'}
            </button>
        </div>
    );
};

export default BoardForm;
