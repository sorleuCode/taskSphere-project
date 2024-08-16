import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EmailVerificationNotice = () => {
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();


  useEffect(() => {
    if (user?.emailVerified && status) {

     setTimeout(() => {
        navigate('/dashboard');
     }, 4000)
    }
  }, [ status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8 lg:p-12 max-w-lg text-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          {user?.emailVerified  ? 'Email Verified' : 'Email Verification'}
        </h1>

        {user?.emailVerified ? (
          <p className="text-gray-600 text-sm md:text-base lg:text-base">
            Your email has been successfully verified..
          </p>
        ) : (
          <>
            <p className="text-gray-600 text-sm md:text-base lg:text-base">
              A verification link has been sent to your inbox. Please check your email and follow the instructions to verify your account.
            </p>
            <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-2">
              If you don't see the email, you may need to check your spam folder.
            </p>
            <p className="text-gray-500 text-xs  md:text-sm lg:text-base mt-3">
              <span className='text-red-500'>
                Entered a wrong Email? <Link className='text-blue-700' to="/">Go back to register page</Link>
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
