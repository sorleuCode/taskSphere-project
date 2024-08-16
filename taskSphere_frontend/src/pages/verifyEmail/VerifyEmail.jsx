import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { verifyUserEmail} from '../../redux/reducers/userSlice';
import './verifyEmail.css';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const dispatch = useDispatch();
    const { loading, user, status, error } = useSelector((state) => state.user);

    useEffect(() => {
        const verifyEmail = async () => {
            dispatch(verifyUserEmail(token));

            if (!loading && user?.emailVerified) {
                setTimeout(() => {
            
                    navigate('/user/verifyEmail');
                }, 3000);
            }

            if (error && !loading) {
                toast.error("Verification not successful", { position: "top-right" });
                navigate('/');
            }
        };

        verifyEmail();
    }, [token, user, loading, error, status, dispatch, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                {loading ? (
                    <div className="flex flex-col items-center">
                        <div className="spinner h-10 w-10 mb-4"></div>
                        <p className="text-blue-700">Verifying your email...</p>
                    </div>
                ) : (
                  (!loading && !user.emailVerified) && <p className="text-gray-800">Please wait...</p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
