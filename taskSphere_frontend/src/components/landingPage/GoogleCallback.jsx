import React, { useEffect, useState } from 'react';
import { registerUser } from '../../redux/reducers/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';

const GoogleCallback = () => {
    const dispatch = useDispatch();
    const { user, error, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (user && !error) {
                    navigate('/dashboard');
                 // Navigate to the dashboard after 5 seconds
            } else {
                setIsLoading(false); // If there’s an error, stop loading
            }
        }
    }, [dispatch, user, error, loading, navigate]);

    return (
        <>
            {isLoading && <Loader />}
        </>
    );
};

export default GoogleCallback;
