import useLoadRecordings from "../hooks/useLoadRecordings";
import useStreamCall from "../hooks/useStreamCall";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function RecordingsList() {
  const call = useStreamCall();

  const { recordings, recordingsLoading } = useLoadRecordings(call);

  const { user} = useSelector((state) => state.user)

  if (!user) {
    return (
      <p className="text-center">You must be logged in to view recordings.</p>
    );
  }

  if (recordingsLoading) return <Loader2 className="mx-auto animate-spin" />;

  return (
    <div className="space-y-3 text-center">
      {recordings.length === 0 && <p>No recordings for this meeting.</p>}
      <ul className="list-inside list-disc">
        {recordings
          .sort((a, b) => b.end_time.localeCompare(a.end_time))
          .map((recording) => (
            <li className=" text-lg" key={recording.url}>
              <a
                href={recording.url}
                target="_blank"
                className="hover:underline"
              >
                {new Date(recording.end_time).toLocaleString()}
              </a>
            </li>
          ))}
      </ul>
      <p className="text-sm text-gray-500">
        Note: It can take up to 1 minute before new recordings show up.
        <br />
        You can refresh the page to see if new recordings are available.
      </p>
    </div>
  );
}
