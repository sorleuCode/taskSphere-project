import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { inviteAcceptance } from '../../../redux/reducers/inviteSlice';
import { toast } from 'react-toastify';


const BoardInviteAcceptance = () => {
    const { invitationId } = useParams();
    const dispatch = useDispatch()
    const { inviteError, inviteAccepted, loading } = useSelector((state) => state.invitation)
    const navigate = useNavigate()


    useEffect(() => {

        if (inviteAccepted && !loading) {
            toast.success(inviteAccepted, { position: "top-right" })
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        }

        if (inviteError && !loading) {
            toast.error(inviteError, { position: "top-right" })
        }


    }, [inviteError, inviteAccepted, loading])

    const handleResponse = async (action) => {

        const actionData = { action }

        try {

            if (invitationId) {
                dispatch(inviteAcceptance({ invitationId, actionData }))
            }

        } catch (error) {
            console.error('Error responding to invitation:', error);
            toast.error(error, {position: "top-right"})
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Invitation to Join Board</h2>
                <p className="text-gray-700 mb-6 text-center">Would you like to accept or reject this invitation?</p>
                <div className="flex justify-around">
                    <button
                        onClick={() => handleResponse('accept')}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => handleResponse('reject')}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoardInviteAcceptance;
