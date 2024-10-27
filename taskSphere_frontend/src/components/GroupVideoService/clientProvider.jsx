import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getClientToken } from "../../redux/reducers/videoSlice";
import { getUserDetail } from "../../redux/reducers/userSlice";
import { fetchCardMembers } from "../../redux/reducers/cardSlice";
import { toast } from "react-toastify";

export default function ClientProvider({ cardId, handleStreamConnect, children }) {
  const { token, errorMessage } = useSelector((state) => state.clientToken);
  const { user, status } = useSelector((state) => state.user);
  const { cardMembers } = useSelector((state) => state.card);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const getTokenFunc = async () => (token ? token : undefined);

  useEffect(() => {
    if (cardMembers?.length === 0) {
      dispatch(fetchCardMembers(cardId));
    }
  }, [dispatch, cardId]);

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;

      if (!loading) {
        setLoading(true);

        if (!status) {
          await dispatch(getUserDetail());
          await dispatch(getClientToken(cardId));
        }

        setLoading(false);
      }
    };

    fetchData();
  }, [token, user._id, loading]);

  if (user && token) {
    let streamUser;
    if (user._id && token) {
      streamUser = {
        id: user._id,
        name: user.fullname,
        image: user.profileImage,
      };
    }

    const apiKey = import.meta.env.VITE_API_KEY_STREAM;
    if (!apiKey) {
      throw new Error("Stream API key not set");
    }

    const client = new StreamVideoClient({
      apiKey,
      user: streamUser,
      tokenProvider: () => (user?._id ? getTokenFunc() : undefined),
    });

    client.on("connect", () => handleStreamConnect(true));

    if (!token && loading) {
      return (
        <div className="flex items-center justify-center">
          <Loader2 className="mx-auto animate-spin" />
        </div>
      );
    }

    return (
      <StreamVideo client={client}>
        {children}
      </StreamVideo>
    );
  } else if (errorMessage) {
    toast.error(errorMessage);
  }

  return null;
}
