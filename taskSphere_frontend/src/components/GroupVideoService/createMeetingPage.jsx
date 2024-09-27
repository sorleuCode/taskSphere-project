
import Button from "./streamComponents/Button";
import {
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Copy, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { inviteToMeeting } from "../../redux/reducers/cardSlice";
import { toast } from "react-toastify";



export default function CreateMeetingPage({ card }) {
  const [descriptionInput, setDescriptionInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  //   const [participantsInput, setParticipantsInput] = useState("");
  const { user } = useSelector((state) => state.user)
  const { cardMembers, loading } = useSelector((state) => state.card)



  const [call, setCall] = useState(null);

  const client = useStreamVideoClient();




  const members = useMemo(() => {
    return cardMembers
      .map((member) => ({ user_id: member?._id, role: "call_member" }))
      .concat({ user_id: user._id, role: "call_member" })
      .filter((v, i, a) => a.findIndex((v2) => v2.user_id === v.user_id) === i);
  }, [cardMembers, user]);




  async function createMeeting() {
    if (!client || !user) {
      return;
    }

    try {
      const id = crypto.randomUUID();

      const callType = "card-members"

      const call = client.call(callType, id);



      const starts_at = new Date(startTimeInput || Date.now()).toISOString();


      await call.getOrCreate({
        data: {
          starts_at,
          members,
          custom: { description: descriptionInput },
        },
      });

      setCall(call);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
    }
  }



  return (
    <div className=" w-full h-full flex justify-center items-center overflow-y">
      <div className="flex flex-col  items-center space-y-6">
        <div className="mx-auto w-80 space-y-6 rounded-md overflow-auto max-h-70vh bg-slate-100 p-5">
          <h2 className="text-xl font-bold">Create a new meeting</h2>
          <DescriptionInput
            value={descriptionInput}
            onChange={setDescriptionInput}
          />
          <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />

          <Button onClick={createMeeting} className="w-full">
            Create meeting
          </Button>
        </div>
        {call && <MeetingLink startTime ={startTimeInput} card={card} call={call} />}
      </div>
    </div>

  );
}

function DescriptionInput({ value, onChange }) {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting info:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={active}
          required
          onChange={(e) => {
            setActive(e.target.checked);
            onChange("");
          }}
        />
        Add description
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Description</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={500}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}

function StartTimeInput({ value, onChange }) {
  const [active, setActive] = useState(false);

  const dateTimeLocalNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting start:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Start meeting immediately
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange(dateTimeLocalNow);
          }}
        />
        Start meeting at date/time
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Start time</span>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={dateTimeLocalNow}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}


function MeetingLink({startTime, card, call }) {

  const dispatch = useDispatch()

  const cardId = card._id
  const meetingLink = `https://tasksphere-six.vercel.app/board/card/${card._id}/meeting/${call.id}`;

  const {loading, videoInviteStatus, error} = useSelector((state) => state.card)

  const videodata = {
    startTime,
    meetingLink,
    cardId
  }


const handleVideoInvite = async() => {

  if(!loading) {
   await dispatch(inviteToMeeting(videodata))
  }

}

useEffect(() => {
  if (loading) return;

  if(videoInviteStatus) {
    toast.success("members notified!")
  }
  if(error) {
    toast.error("server error")
  }
}, [videoInviteStatus])
 



  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-3">
        <span>
          Invitation link:{" "}
        </span>
        <button
          title="Copy invitation link"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            alert("Copied to clipboard");
          }}
        >
          <Copy />
        </button>
      </div>
      <button
      onClick={handleVideoInvite}
        className="text-blue-500 hover:underline"
      >
        invite members
      </button>
    </div>
  );
}

// function getMailToLink(meetingLink, startsAt, description, recipients) {


//   const startDateFormatted = startsAt
//     ? new Date(startsAt).toLocaleString("en-US", {
//       dateStyle: "full",
//       timeStyle: "short",
//     })
//     : undefined;

//   const subject =
//     "Join my meeting" + (startDateFormatted ? ` at ${startDateFormatted}` : "");

//   const body =
//     `Join my meeting at ${meetingLink}.` +
//     (startDateFormatted
//       ? `\n\nThe meeting starts at ${startDateFormatted}.`
//       : "") +
//     (description ? `\n\nDescription: ${description}` : "");

//   // Join the recipients into a comma-separated string
//   const to = recipients?.join(",");

//   return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
// }
