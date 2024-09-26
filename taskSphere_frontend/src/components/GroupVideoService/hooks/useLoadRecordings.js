import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useLoadRecordings(call) {
  const { user } = useSelector((state) => state.user)

  const [recordings, setRecordings] = useState([]);
  const [recordingsLoading, setRecordingsLoading] = useState(true);

  useEffect(() => {
    async function loadRecordings() {
      setRecordingsLoading(true);

      if (!user?._id) return;

      const { recordings } = await call.queryRecordings();
      setRecordings(recordings);

      setRecordingsLoading(false);
    }

    loadRecordings();
  }, [call, user?._id]);

  return { recordings, recordingsLoading };
}
