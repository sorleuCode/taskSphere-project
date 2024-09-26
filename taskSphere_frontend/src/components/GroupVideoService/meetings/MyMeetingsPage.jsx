import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MyMeetingsPage() {
  const { user } = useSelector((state) => state.user);
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredCalls, setFilteredCalls] = useState([]);
  
  useEffect(() => {
    async function loadCalls() {
      if (!client || !user?._id) {
        return;
      }

      const { calls } = await client.queryCalls({
        sort: [{ field: "starts_at", direction: -1 }],
        filter_conditions: {
          starts_at: { $exists: true },
          $or: [
            { created_by_user_id: user._id },
            { members: { $in: [user._id] } },
          ],
        },
      });

      setCalls(calls);
      setFilteredCalls(calls);
    }

    loadCalls();
  }, [client, user?._id]);

  // Filter and search handler
  useEffect(() => {
    const filtered = calls.filter((call) => {
      const isInFuture =
        call.state.startsAt && new Date(call.state.startsAt) > new Date();
      const hasEnded = !!call.state.endedAt;

      let statusMatch = true;
      if (statusFilter === "upcoming" && !isInFuture) statusMatch = false;
      if (statusFilter === "ended" && !hasEnded) statusMatch = false;
      if (statusFilter === "ongoing" && (isInFuture || hasEnded)) statusMatch = false;

      const descriptionMatch =
        call.state.custom.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return statusMatch && descriptionMatch;
    });
    setFilteredCalls(filtered);
  }, [calls, searchTerm, statusFilter]);

  return (
    <div className="space-y-3 p-4">
      <h1 className="text-center text-2xl my-2 font-bold">My Meetings</h1>

      <div className="flex justify-between items-center space-y-2">
        <input
          type="text"
          placeholder="Search by description..."
          className="border border-blue-200 focus:border-blue-400  focus:outline p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className=" border border-blue-200 focus:border-blue-400  focus:outline p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="ended">Ended</option>
        </select>
      </div>

      {!calls && <Loader2 className="mx-auto animate-spin" />}
      {filteredCalls?.length === 0 && <p>No meetings found</p>}

      {filteredCalls?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black-800 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCalls.map((call) => (
                <MeetingRow key={call.id} call={call} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MeetingRow({ call }) {
  const { cardId } = useParams();
  const meetingLink = `/board/card/${cardId}/meeting/${call.id}`;
  const [showModal, setShowModal] = useState(false);

  const isInFuture =
    call.state.startsAt && new Date(call.state.startsAt) > new Date();
  const hasEnded = !!call.state.endedAt;

  let statusText = '';
  if (isInFuture) {
    statusText = 'Upcoming';
  } else if (hasEnded) {
    statusText = 'Ended';
  } else {
    statusText = 'Ongoing';
  }

  // Truncate description to 10 characters
  const truncatedDescription =
    call.state.custom.description?.length > 10
      ? call.state.custom.description.substring(0, 10) + "..."
      : call.state.custom.description;

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link to={meetingLink} className="text-blue-600 hover:underline">
          {new Date(call.state.startsAt).toLocaleString()}
        </Link>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setShowModal(true)}
        >
          {truncatedDescription || "No description available"}
        </span>

        {showModal && (
          <DescriptionModal
            description={call.state.custom.description}
            onClose={() => setShowModal(false)}
          />
        )}
      </td>
      <td className="px-6 py-4 text-sm">{statusText}</td>
    </tr>
  );
}

function DescriptionModal({ description, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-lg font-bold">Meeting Description</h2>
        <p className="mt-2 text-sm text-gray-700">{description}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
