import React, { useEffect, useState } from 'react';
import { registerUser } from '../../redux/reducers/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';
import { getUserDetail } from '../../redux/reducers/userSlice';

const GoogleCallback = () => {
    const dispatch = useDispatch();
    const { user, status, error, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loading) return
        
            if (user && status) {
                    navigate('/dashboard');
            } else {
                setIsLoading(false)
            }
        
    }, [dispatch, user, error, loading, navigate]);

    useEffect(() => {
        if(!status) {
            dispatch(getUserDetail())
        }
    }, [dispatch, status])

    return (
        <>
            {isLoading && <Loader />}
        </>
    );
};

export default GoogleCallback;
