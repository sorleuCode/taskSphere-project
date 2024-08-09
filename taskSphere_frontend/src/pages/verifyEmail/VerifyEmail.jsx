import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { verifyEmail, resetVerificationState } from '../features/verification/verificationSlice';


const VerifyEmail = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const {token} = useParams()
    // const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const { loading, message, error } = useSelector((state) => state.verification);


    // useEffect(() => {
    //     dispatch(verifyEmail());

    //     return () => {
    //         dispatch(resetVerificationState());
    //     };
    // }, [token, dispatch]);

    // useEffect(() => {
    //     if (message) {
    //         alert(message);
    //         navigate('/dashboard');
    //     }
    //     if (error) {
    //         alert(error);
    //         navigate('/register');
    //     }
    // }, [message, error, navigate]);

    useEffect(() => {

            const verifyEmail = async () => {
                    try {
                        const response = await axios.get(`http://localhost:3500/users/verifyEmail/${token}`, {withCredentials: true})

                        if (response.data) {
                            console.log(response.data)

                            setLoading(true)
                            setTimeout(() => {

                                toast.success("Email verification successful")
                                navigate("/dashboard")

                            }, 5000)

                        
                        

                        }else{
                            console.log("there is error")
                        navigate("/")
                        }
                        
                        
                    } catch (error) {
                        toast.error("Email verification failed!")
                        console.log(error)
                        navigate("/")

                    }
            }
            verifyEmail();
        }, [token] )


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                {loading ? (
                    <div className="flex flex-col items-center">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-12 w-12 mb-4"></div>
                        <p className="text-blue-700">Verifying your email...</p>
                    </div>
                ) : (
                    <p className="text-gray-800">Please wait...</p>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail
